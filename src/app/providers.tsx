"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { WebSocketProvider } from "@/contexts/websocket-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WebSocketProvider>{children}</WebSocketProvider>
    </Provider>
  );
}
