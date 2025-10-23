const { WebSocketServer } = require("ws");
const { createServer } = require("http");
const { PrismaClient } = require("@prisma/client");

// Initialize Prisma client
const prisma = new PrismaClient();

// Simple in-memory storage
const connectedUsers = new Map();
const userSessions = new Map();

class SimpleWebSocketServer {
  constructor(port = 3001) {
    this.port = port;
    this.server = createServer();
    this.wss = new WebSocketServer({
      server: this.server,
      path: "/ws-online-status",
    });

    this.setupWebSocketServer();
    this.startHeartbeat();
  }

  setupWebSocketServer() {
    this.wss.on("connection", (ws, req) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const userId = url.searchParams.get("userId");

      if (!userId) {
        ws.close(1008, "User ID required");
        return;
      }

      const userIdNum = parseInt(userId);
      console.log(`🚀 WS: User ${userIdNum} connected`);

      // Store user connection
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

      // Notify all other users
      this.broadcastUserStatus(userIdNum, true);

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      // Handle incoming messages (chat messages, support messages)
      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message);
          console.log(
            `📨 WS: Received message from user ${userIdNum}:`,
            data.type,
          );

          // Handle regular chat messages
          if (data.type === "NEW_MESSAGE" && data.sender_id) {
            const newMessage = await prisma.messages.create({
              data: {
                chat_id: data.chat_id,
                sender_id: data.sender_id,
                content: data.content,
                file_type: data.file_type || null,
                file_paths: data.file_paths || null,
                selected_chat_id: data.selected_chat_id || null,
                created_at: new Date(),
              },
            });

            console.log(`💬 WS: New message created with ID: ${newMessage.id}`);

            // Broadcast message to all connected users
            this.broadcastToAllClients({
              type: "MESSAGE",
              payload: newMessage,
            });
          }

          // Handle support messages
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

            console.log(
              `🆘 WS: New support message created with ID: ${newSupportMessage.id}`,
            );

            // Broadcast support message to all connected users
            this.broadcastToAllClients({
              type: "SUPPORT_MESSAGE",
              payload: newSupportMessage,
            });
          }
        } catch (error) {
          console.error(
            `❌ WS: Error handling message from user ${userIdNum}:`,
            error,
          );
        }
      });

      ws.on("close", () => {
        console.log(`🔌 WS: User ${userIdNum} disconnected`);
        this.handleUserDisconnect(userIdNum);
      });

      ws.on("error", (error) => {
        console.error(`❌ WS: WebSocket error for user ${userIdNum}:`, error);
        this.handleUserDisconnect(userIdNum);
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
  }

  broadcastUserStatus(userId, isOnline) {
    const message = {
      type: isOnline ? "USER_ONLINE" : "USER_OFFLINE",
      userId,
      timestamp: new Date().toISOString(),
    };

    console.log(`📡 WS: User ${userId} is ${isOnline ? "ONLINE" : "OFFLINE"}`);

    // Broadcast to all connected users except the user themselves
    let broadcastCount = 0;
    connectedUsers.forEach((userClients, clientUserId) => {
      if (clientUserId !== userId) {
        userClients.forEach((client) => {
          if (client.readyState === 1) {
            try {
              client.send(JSON.stringify(message));
              broadcastCount++;
            } catch (error) {
              console.error(`Failed to send to user ${clientUserId}:`, error);
            }
          }
        });
      }
    });

    console.log(`📡 WS: Broadcast sent to ${broadcastCount} users`);
  }

  // Broadcast message to all connected clients
  broadcastToAllClients(message) {
    let broadcastCount = 0;
    connectedUsers.forEach((userClients, clientUserId) => {
      userClients.forEach((client) => {
        if (client.readyState === 1) {
          try {
            client.send(JSON.stringify(message));
            broadcastCount++;
          } catch (error) {
            console.error(
              `Failed to send message to user ${clientUserId}:`,
              error,
            );
          }
        }
      });
    });

    console.log(`📡 WS: Message broadcast sent to ${broadcastCount} users`);
  }

  handleUserDisconnect(userId) {
    const userClients = connectedUsers.get(userId);
    if (userClients) {
      userClients.clear();
      connectedUsers.delete(userId);
    }

    // Update session info
    if (userSessions.has(userId)) {
      userSessions.set(userId, {
        ...userSessions.get(userId),
        isOnline: false,
        lastSeen: new Date(),
        disconnectedAt: new Date(),
      });
    }

    // Notify all other users
    this.broadcastUserStatus(userId, false);
  }

  startHeartbeat() {
    setInterval(() => {
      connectedUsers.forEach((userClients, userId) => {
        userClients.forEach((client) => {
          if (!client.isAlive) {
            console.log(
              `💔 WS: User ${userId} heartbeat failed - disconnecting`,
            );
            client.terminate();
            this.handleUserDisconnect(userId);
            return;
          }
          client.isAlive = false;
          client.ping();
        });
      });
    }, 30000); // 30 seconds heartbeat
  }

  getStats() {
    return {
      connectedUsers: connectedUsers.size,
      totalConnections: Array.from(connectedUsers.values()).reduce(
        (sum, clients) => sum + clients.size,
        0,
      ),
      userSessions: userSessions.size,
    };
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`🚀 WS: WebSocket server running on port ${this.port}`);
      console.log(`⚡ Real-time online status enabled`);
      console.log(
        `📡 WebSocket URL: ws://localhost:${this.port}/ws-online-status`,
      );

      // Log stats every 30 seconds
      setInterval(() => {
        const stats = this.getStats();
        console.log(
          `📊 WS Stats: ${stats.connectedUsers} users, ${stats.totalConnections} connections`,
        );
      }, 30000);
    });
  }

  stop() {
    this.server.close();
  }
}

// Start the simple server
const wsServer = new SimpleWebSocketServer();
wsServer.start();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down WS server...");
  wsServer.stop();

  // Disconnect Prisma client
  try {
    await prisma.$disconnect();
    console.log("✅ Prisma client disconnected");
  } catch (error) {
    console.error("❌ Error disconnecting Prisma:", error);
  }

  process.exit(0);
});

module.exports = SimpleWebSocketServer;
