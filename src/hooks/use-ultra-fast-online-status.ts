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

interface UseUltraFastOnlineStatusOptions {
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useUltraFastOnlineStatus(
  callbacks: OnlineStatusCallbacks,
  options: UseUltraFastOnlineStatusOptions = {},
) {
  const { data: session }: any = useSession();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);

  const {
    autoConnect = true,
    reconnectInterval = 1000, // 1 second for ultra-fast reconnection
    maxReconnectAttempts = 15,
  } = options;

  // ULTRA-FAST connection function
  const connectUltraFast = useCallback(() => {
    if (!session?.user?.id || isConnectingRef.current) return;

    const userId = session.user.id;
    const wsUrl =
      process.env.NODE_ENV === "production"
        ? `wss://yourdomain.com:3001/ws-online-status?userId=${userId}`
        : `ws://localhost:3001/ws-online-status?userId=${userId}`;

    console.log(`⚡ ULTRA-FAST: Connecting to WebSocket for user ${userId}`);
    isConnectingRef.current = true;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`✅ ULTRA-FAST: WebSocket connected for user ${userId}`);
        isConnectingRef.current = false;
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message: OnlineStatusMessage = JSON.parse(event.data);
          console.log(`📨 ULTRA-FAST: Received message:`, message);

          // ULTRA-FAST message handling
          switch (message.type) {
            case "USER_ONLINE":
              if (message.instant) {
                console.log(
                  `🟢 ULTRA-FAST: User ${message.userId} came ONLINE`,
                );
                callbacks.onUserOnline(message.userId);
              }
              break;

            case "USER_OFFLINE":
              if (message.instant) {
                console.log(
                  `🔴 ULTRA-FAST: User ${message.userId} went OFFLINE`,
                );
                callbacks.onUserOffline(message.userId);
              }
              break;

            case "STATUS_UPDATE":
              if (message.lastSeen) {
                console.log(
                  `🔄 ULTRA-FAST: User ${message.userId} status update`,
                );
                callbacks.onStatusUpdate(
                  message.userId,
                  new Date(message.lastSeen),
                );
              }
              break;

            case "CONNECTION_ESTABLISHED":
              console.log(
                `🎯 ULTRA-FAST: Connection established for user ${message.userId}`,
              );
              break;
          }
        } catch (error) {
          console.error(
            "❌ ULTRA-FAST: Error parsing WebSocket message:",
            error,
          );
        }
      };

      ws.onclose = (event) => {
        console.log(
          `🔌 ULTRA-FAST: WebSocket closed for user ${userId}:`,
          event.code,
          event.reason,
        );
        isConnectingRef.current = false;
        wsRef.current = null;

        // ULTRA-FAST reconnection - 1 second delay
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          console.log(
            `🔄 ULTRA-FAST: Attempting reconnection ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts}`,
          );
          reconnectAttemptsRef.current++;

          reconnectTimeoutRef.current = setTimeout(() => {
            connectUltraFast();
          }, reconnectInterval);
        } else {
          console.error(
            `❌ ULTRA-FAST: Max reconnection attempts reached for user ${userId}`,
          );
        }
      };

      ws.onerror = (error) => {
        console.error(
          `❌ ULTRA-FAST: WebSocket error for user ${userId}:`,
          error,
        );
        isConnectingRef.current = false;
      };
    } catch (error) {
      console.error(
        `❌ ULTRA-FAST: Failed to create WebSocket for user ${userId}:`,
        error,
      );
      isConnectingRef.current = false;
    }
  }, [session?.user?.id, callbacks, reconnectInterval, maxReconnectAttempts]);

  // ULTRA-FAST disconnect function
  const disconnectUltraFast = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      console.log(
        `🔌 ULTRA-FAST: Disconnecting WebSocket for user ${session?.user?.id}`,
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
      connectUltraFast();
    }

    return () => {
      disconnectUltraFast();
    };
  }, [autoConnect, session?.user?.id, connectUltraFast, disconnectUltraFast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectUltraFast();
    };
  }, [disconnectUltraFast]);

  return {
    connect: connectUltraFast,
    disconnect: disconnectUltraFast,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    reconnectAttempts: reconnectAttemptsRef.current,
  };
}
