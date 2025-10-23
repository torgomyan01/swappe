"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";

interface OnlineStatusMessage {
  type:
    | "USER_ONLINE"
    | "USER_OFFLINE"
    | "STATUS_UPDATE"
    | "CONNECTION_ESTABLISHED";
  userId: number;
  lastSeen?: Date;
  isOnline?: boolean;
}

interface OnlineStatusCallback {
  onUserOnline: (userId: number) => void;
  onUserOffline: (userId: number) => void;
  onStatusUpdate: (userId: number, lastSeen: Date) => void;
}

export const useRealtimeOnlineStatus = (callbacks: OnlineStatusCallback) => {
  const { data: session }: any = useSession();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const connect = useCallback(() => {
    if (!session?.user?.id || isConnectingRef.current) return;

    isConnectingRef.current = true;

    const wsUrl =
      process.env.NODE_ENV === "production"
        ? `wss://${window.location.hostname}:3001/ws-online-status?userId=${session.user.id}`
        : `ws://localhost:3001/ws-online-status?userId=${session.user.id}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🔗 Connected to online status WebSocket");
        isConnectingRef.current = false;

        // Clear any pending reconnect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: OnlineStatusMessage = JSON.parse(event.data);
          console.log("📨 Received WebSocket message:", message);

          switch (message.type) {
            case "USER_ONLINE":
              console.log(
                `🟢 Processing USER_ONLINE for user ${message.userId}`,
              );
              callbacks.onUserOnline(message.userId);
              break;
            case "USER_OFFLINE":
              console.log(
                `🔴 Processing USER_OFFLINE for user ${message.userId}`,
              );
              callbacks.onUserOffline(message.userId);
              break;
            case "STATUS_UPDATE":
              console.log(
                `🔄 Processing STATUS_UPDATE for user ${message.userId}`,
              );
              if (message.lastSeen) {
                callbacks.onStatusUpdate(
                  message.userId,
                  new Date(message.lastSeen),
                );
              }
              break;
            case "CONNECTION_ESTABLISHED":
              console.log(
                `✅ Connection established for user ${message.userId}`,
              );
              break;
          }
        } catch (error) {
          console.error("❌ Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log(
          "Online status WebSocket disconnected:",
          event.code,
          event.reason,
        );
        isConnectingRef.current = false;

        // Attempt to reconnect after 3 seconds
        if (event.code !== 1000) {
          // Don't reconnect if closed normally
          reconnectTimeoutRef.current = setTimeout(() => {
            if (session?.user?.id) {
              connect();
            }
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error("Online status WebSocket error:", error);
        isConnectingRef.current = false;
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      isConnectingRef.current = false;
    }
  }, [session?.user?.id, callbacks]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, "Component unmounting");
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [session?.user?.id, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    reconnect: connect,
  };
};
