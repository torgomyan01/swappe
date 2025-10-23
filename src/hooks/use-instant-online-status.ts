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
  timestamp?: string;
  instant?: boolean;
}

interface OnlineStatusCallbacks {
  onUserOnline: (userId: number) => void;
  onUserOffline: (userId: number) => void;
  onStatusUpdate: (userId: number, lastSeen: Date) => void;
}

interface UseInstantOnlineStatusOptions {
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useInstantOnlineStatus(
  callbacks: OnlineStatusCallbacks,
  options: UseInstantOnlineStatusOptions = {},
) {
  const { data: session }: any = useSession();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);

  const {
    autoConnect = true,
    reconnectInterval = 2000, // 2 seconds for instant reconnection
    maxReconnectAttempts = 10,
  } = options;

  // INSTANT connection function
  const connectInstant = useCallback(() => {
    if (!session?.user?.id || isConnectingRef.current) return;

    const userId = session.user.id;
    const wsUrl =
      process.env.NODE_ENV === "production"
        ? `wss://yourdomain.com:3001/ws-online-status?userId=${userId}`
        : `ws://localhost:3001/ws-online-status?userId=${userId}`;

    console.log(`⚡ INSTANT: Connecting to WebSocket for user ${userId}`);
    isConnectingRef.current = true;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`✅ INSTANT: WebSocket connected for user ${userId}`);
        isConnectingRef.current = false;
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message: OnlineStatusMessage = JSON.parse(event.data);
          console.log(`📨 INSTANT: Received message:`, message);

          // INSTANT message handling
          switch (message.type) {
            case "USER_ONLINE":
              if (message.instant) {
                console.log(`🟢 INSTANT: User ${message.userId} came ONLINE`);
                callbacks.onUserOnline(message.userId);
              }
              break;

            case "USER_OFFLINE":
              if (message.instant) {
                console.log(`🔴 INSTANT: User ${message.userId} went OFFLINE`);
                callbacks.onUserOffline(message.userId);
              }
              break;

            case "STATUS_UPDATE":
              if (message.lastSeen) {
                console.log(`🔄 INSTANT: User ${message.userId} status update`);
                callbacks.onStatusUpdate(
                  message.userId,
                  new Date(message.lastSeen),
                );
              }
              break;

            case "CONNECTION_ESTABLISHED":
              console.log(
                `🎯 INSTANT: Connection established for user ${message.userId}`,
              );
              break;
          }
        } catch (error) {
          console.error("❌ INSTANT: Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log(
          `🔌 INSTANT: WebSocket closed for user ${userId}:`,
          event.code,
          event.reason,
        );
        isConnectingRef.current = false;
        wsRef.current = null;

        // INSTANT reconnection - no delay
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          console.log(
            `🔄 INSTANT: Attempting reconnection ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts}`,
          );
          reconnectAttemptsRef.current++;

          reconnectTimeoutRef.current = setTimeout(() => {
            connectInstant();
          }, reconnectInterval);
        } else {
          console.error(
            `❌ INSTANT: Max reconnection attempts reached for user ${userId}`,
          );
        }
      };

      ws.onerror = (error) => {
        console.error(`❌ INSTANT: WebSocket error for user ${userId}:`, error);
        isConnectingRef.current = false;
      };
    } catch (error) {
      console.error(
        `❌ INSTANT: Failed to create WebSocket for user ${userId}:`,
        error,
      );
      isConnectingRef.current = false;
    }
  }, [session?.user?.id, callbacks, reconnectInterval, maxReconnectAttempts]);

  // INSTANT disconnect function
  const disconnectInstant = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      console.log(
        `🔌 INSTANT: Disconnecting WebSocket for user ${session?.user?.id}`,
      );
      wsRef.current.close();
      wsRef.current = null;
    }

    isConnectingRef.current = false;
    reconnectAttemptsRef.current = 0;
  }, [session?.user?.id]);

  // Auto-connect on mount and session change
  useEffect(() => {
    if (autoConnect && session?.user?.id) {
      connectInstant();
    }

    return () => {
      disconnectInstant();
    };
  }, [autoConnect, session?.user?.id, connectInstant, disconnectInstant]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectInstant();
    };
  }, [disconnectInstant]);

  return {
    connect: connectInstant,
    disconnect: disconnectInstant,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    reconnectAttempts: reconnectAttemptsRef.current,
  };
}
