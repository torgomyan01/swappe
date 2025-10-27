import { PrismaClient } from "@prisma/client";
import { WebSocketServer, WebSocket } from "ws";

const prisma = new PrismaClient();

const wss = new WebSocketServer({ port: 3004 });

// Keep track of connected clients
const clients = new Set();

// Ping clients every 30 seconds to keep connection alive
setInterval(() => {
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    }
  });
}, 30000);

wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  // Send a welcome message to confirm connection
  ws.send(
    JSON.stringify({
      type: "CONNECTION_ESTABLISHED",
      message: "Connected to WebSocket server",
    }),
  );

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "NEW_MESSAGE" && data.sender_id) {
        // Check user subscription status before allowing message
        const user = await prisma.users.findUnique({
          where: { id: data.sender_id },
          select: {
            tariff: true,
            tariff_end_date: true,
          },
        });

        // Check if user has active paid subscription
        const hasActiveSubscription =
          user &&
          user.tariff !== "free" &&
          user.tariff_end_date &&
          new Date(user.tariff_end_date) > new Date();

        if (!hasActiveSubscription) {
          // Notify sender that they need to upgrade
          ws.send(
            JSON.stringify({
              type: "SUBSCRIPTION_REQUIRED",
              message:
                "Для отправки сообщений необходимо активировать тарифный план",
              link: "/account/tariffs-bonuses",
            }),
          );
          return;
        }

        const newMessage = await prisma.messages.create({
          data: {
            chat_id: data.chat_id,
            sender_id: data.sender_id,
            content: data.content,
            file_type: data.file_type || null, // Կամայական դաշտեր
            file_paths: data.file_paths || null,
            selected_chat_id: data.selected_chat_id || null,
            created_at: new Date(),
          },
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({ type: "MESSAGE", payload: newMessage }),
            );
          }
        });
      }

      // Support messages channel
      if (data.type === "NEW_SUPPORT_MESSAGE" && data.sender_id) {
        const newSupportMessage = await prisma.support_messages.create({
          data: {
            support_chat_id: data.support_chat_id,
            sender_id: data.sender_id,
            content: data.content,
            file_type: data.file_type || null,
            file_paths: data.file_paths || null,
            created_at: new Date(),
          },
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "SUPPORT_MESSAGE",
                payload: newSupportMessage,
              }),
            );
          }
        });
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  ws.on("close", (code, reason) => {
    console.log(`Client disconnected. Code: ${code}, Reason: ${reason}`);
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
