import { PrismaClient } from "@prisma/client";
import { WebSocketServer } from "ws";
const prisma = new PrismaClient();

const wss = new WebSocketServer({ port: 3004 });

// eslint-disable-next-line no-undef
console.log("WebSocket server is running on port 3004");

wss.on("connection", (ws) => {
  // eslint-disable-next-line no-undef
  console.log("Client connected");

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "NEW_MESSAGE") {
        const newMessage = await prisma.messages.create({
          data: {
            chat_id: data.chat_id,
            sender_id: data.sender_id,
            content: data.content,
            file_type: data.file_type,
            file_paths: data.file_paths,
            selected_chat_id: data.selected_chat_id,
            created_at: new Date(),
          },
        });

        wss.clients.forEach((client) => {
          // eslint-disable-next-line no-undef
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({ type: "MESSAGE", payload: newMessage }),
            );
          }
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-undef
      console.error("Error handling message:", error);
    }
  });

  ws.on("close", () => {
    // eslint-disable-next-line no-undef
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    // eslint-disable-next-line no-undef
    console.error("WebSocket error:", error);
  });
});
