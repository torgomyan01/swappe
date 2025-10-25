"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import { useSession } from "next-auth/react";

interface WebSocketContextType {
  ws: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
  onMessage: (callback: (data: any) => void) => void;
  offMessage: (callback: (data: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messageCallbacks, setMessageCallbacks] = useState<
    Set<(data: any) => void>
  >(new Set());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const { data: session } = useSession();

  // Initialize WebSocket connection
  useEffect(() => {
    if (!(session?.user as any)?.id) return;

    const connect = () => {
      const wsUrl =
        process.env.NODE_ENV === "production"
          ? `wss://${window.location.host}/ws`
          : "ws://localhost:3004";

      const wsClient = new WebSocket(wsUrl);

      wsClient.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
      };

      wsClient.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Call all registered message callbacks
          messageCallbacks.forEach((callback) => {
            try {
              callback(data);
            } catch (error) {
              console.error("Error in message callback:", error);
            }
          });
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsClient.onclose = (event) => {
        setIsConnected(false);
        setWs(null);

        // Only attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            30000,
          ); // Exponential backoff, max 30s

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else {
          console.log(
            "Max reconnection attempts reached. Please refresh the page.",
          );
        }
      };

      wsClient.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      setWs(wsClient);
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [(session?.user as any)?.id, messageCallbacks]);

  // Send message function
  const sendMessage = useCallback(
    (message: any) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      } else {
        console.warn(
          "WebSocket is not connected. Cannot send message:",
          message,
        );
      }
    },
    [ws],
  );

  // Register message callback
  const onMessage = useCallback((callback: (data: any) => void) => {
    setMessageCallbacks((prev) => new Set([...prev, callback]));
  }, []);

  // Unregister message callback
  const offMessage = useCallback((callback: (data: any) => void) => {
    setMessageCallbacks((prev) => {
      const newSet = new Set(prev);
      newSet.delete(callback);
      return newSet;
    });
  }, []);

  const value: WebSocketContextType = {
    ws,
    isConnected,
    sendMessage,
    onMessage,
    offMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
