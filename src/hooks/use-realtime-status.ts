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
  connectionId?: string;
}

interface OnlineStatusCallbacks {
  onUserOnline: (userId: number) => void;
  onUserOffline: (userId: number) => void;
  onStatusUpdate: (userId: number, lastSeen: Date) => void;
}

interface UseRealtimeStatusOptions {
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  connectionTimeout?: number;
}

export function useRealtimeStatus(
  callbacks: OnlineStatusCallbacks,
  options: UseRealtimeStatusOptions = {},
) {
  const { data: session }: any = useSession();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);
  const lastConnectionIdRef = useRef<string | null>(null);

  const {
    autoConnect = true,
    reconnectInterval = 3000, // 3 seconds
    maxReconnectAttempts = 10,
    connectionTimeout = 30000, // 30 seconds
  } = options;

  // Connection function with timeout
  const connect = useCallback(() => {
    if (!session?.user?.id || isConnectingRef.current) return;

    const userId = session.user.id;
    const wsUrl =
      process.env.NODE_ENV === "production"
        ? `wss://yourdomain.com:3001/ws-online-status?userId=${userId}`
        : `ws://localhost:3001/ws-online-status?userId=${userId}`;

    console.log(`🚀 REALTIME: Connecting to WebSocket for user ${userId}`);
    isConnectingRef.current = true;

    // Set connection timeout
    connectionTimeoutRef.current = setTimeout(() => {
      console.log(`⏰ REALTIME: Connection timeout for user ${userId}`);
      if (wsRef.current) {
        wsRef.current.close();
      }
      isConnectingRef.current = false;
    }, connectionTimeout);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`✅ REALTIME: WebSocket connected for user ${userId}`);
        isConnectingRef.current = false;
        reconnectAttemptsRef.current = 0;

        // Clear connection timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: OnlineStatusMessage = JSON.parse(event.data);
          console.log(`📨 REALTIME: Received message:`, message);

          switch (message.type) {
            case "USER_ONLINE":
              console.log(`🟢 REALTIME: User ${message.userId} came ONLINE`);
              callbacks.onUserOnline(message.userId);
              break;

            case "USER_OFFLINE":
              console.log(`🔴 REALTIME: User ${message.userId} went OFFLINE`);
              callbacks.onUserOffline(message.userId);
              break;

            case "STATUS_UPDATE":
              if (message.lastSeen) {
                console.log(
                  `🔄 REALTIME: User ${message.userId} status update`,
                );
                callbacks.onStatusUpdate(
                  message.userId,
                  new Date(message.lastSeen),
                );
              }
              break;

            case "CONNECTION_ESTABLISHED":
              console.log(
                `🎯 REALTIME: Connection established for user ${message.userId}`,
              );
              if (message.connectionId) {
                lastConnectionIdRef.current = message.connectionId;
              }
              break;
          }
        } catch (error) {
          console.error("❌ REALTIME: Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log(
          `🔌 REALTIME: WebSocket closed for user ${userId}:`,
          event.code,
          event.reason,
        );
        isConnectingRef.current = false;
        wsRef.current = null;

        // Clear connection timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }

        // Auto-reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          console.log(
            `🔄 REALTIME: Attempting reconnection ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts}`,
          );
          reconnectAttemptsRef.current++;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          console.error(
            `❌ REALTIME: Max reconnection attempts reached for user ${userId}`,
          );
        }
      };

      ws.onerror = (error) => {
        console.error(
          `❌ REALTIME: WebSocket error for user ${userId}:`,
          error,
        );
        isConnectingRef.current = false;
      };
    } catch (error) {
      console.error(
        `❌ REALTIME: Failed to create WebSocket for user ${userId}:`,
        error,
      );
      isConnectingRef.current = false;
    }
  }, [
    session?.user?.id,
    callbacks,
    reconnectInterval,
    maxReconnectAttempts,
    connectionTimeout,
  ]);

  // Disconnect function
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    if (wsRef.current) {
      console.log(
        `🔌 REALTIME: Disconnecting WebSocket for user ${session?.user?.id}`,
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
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, session?.user?.id, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    reconnectAttempts: reconnectAttemptsRef.current,
    connectionId: lastConnectionIdRef.current,
  };
}
