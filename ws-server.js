import { PrismaClient } from "@prisma/client";
import { WebSocketServer, WebSocket } from "ws";

const prisma = new PrismaClient();

// Simple in-memory storage for online status
const connectedUsers = new Map();
const userSessions = new Map();

const wss = new WebSocketServer({ port: 3004 });

wss.on("connection", (ws, req) => {
  // Extract userId from query parameters
  const url = new URL(req.url, `http://${req.headers.host}`);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    ws.close(1008, "User ID required");
    return;
  }

  const userIdNum = parseInt(userId);
  console.log(`🚀 WS: User ${userIdNum} connected`);

  // Store user connection for online status
  if (!connectedUsers.has(userIdNum)) {
    connectedUsers.set(userIdNum, new Set());
  }
  connectedUsers.get(userIdNum).add(ws);

  // Update session info
  userSessions.set(userIdNum, {
    lastSeen: new Date(),
    isOnline: true,
    connectedAt: new Date(),
  });

  // Notify all other users that this user is online
  broadcastUserStatus(userIdNum, true);

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "NEW_MESSAGE" && data.sender_id) {
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

  // Handle heartbeat for online status
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("close", () => {
    console.log(`🔌 WS: User ${userIdNum} disconnected`);
    handleUserDisconnect(userIdNum);
  });

  ws.on("error", (error) => {
    console.error(`❌ WS: WebSocket error for user ${userIdNum}:`, error);
    handleUserDisconnect(userIdNum);
  });

  // Send connection confirmation
  ws.send(
    JSON.stringify({
      type: "CONNECTION_ESTABLISHED",
      userId: userIdNum,
      timestamp: new Date().toISOString(),
    }),
  );
});
