const { WebSocketServer } = require("ws");
const { createServer } = require("http");
const { parse } = require("url");

// Simple in-memory storage for demo purposes
// In production, you'd want to use Redis or similar
const connectedUsers = new Map();
const userSessions = new Map();

class OnlineStatusServer {
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
      const url = parse(req.url, true);
      const userId = url.query.userId;

      if (!userId) {
        ws.close(1008, "User ID required");
        return;
      }

      const userIdNum = parseInt(userId);
      console.log(`User ${userIdNum} connected to online status WebSocket`);

      // Store user connection
      if (!connectedUsers.has(userIdNum)) {
        connectedUsers.set(userIdNum, new Set());
      }
      connectedUsers.get(userIdNum).add(ws);

      // Store session info
      userSessions.set(userIdNum, {
        lastSeen: new Date(),
        isOnline: true,
      });

      // Notify other users that this user is online
      this.broadcastUserStatus(userIdNum, true);

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("close", () => {
        console.log(
          `User ${userIdNum} disconnected from online status WebSocket`,
        );
        this.handleUserDisconnect(userIdNum);
      });

      ws.on("error", (error) => {
        console.error(`WebSocket error for user ${userIdNum}:`, error);
      });

      // Send initial status to the connected user
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

    // Broadcast to all connected users except the user themselves
    connectedUsers.forEach((userClients, clientUserId) => {
      if (clientUserId !== userId) {
        userClients.forEach((client) => {
          if (client.readyState === 1) {
            // WebSocket.OPEN
            client.send(JSON.stringify(message));
          }
        });
      }
    });
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
      });
    }

    // Notify other users that this user went offline
    this.broadcastUserStatus(userId, false);
  }

  startHeartbeat() {
    setInterval(() => {
      connectedUsers.forEach((userClients, userId) => {
        userClients.forEach((client) => {
          if (!client.isAlive) {
            client.terminate();
            this.handleUserDisconnect(userId);
            return;
          }
          client.isAlive = false;
          client.ping();
        });
      });
    }, 30000); // 30 seconds
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(
        `Online Status WebSocket server running on port ${this.port}`,
      );
    });
  }

  stop() {
    this.server.close();
  }
}

// Start the server
const onlineStatusServer = new OnlineStatusServer();
onlineStatusServer.start();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down Online Status WebSocket server...");
  onlineStatusServer.stop();
  process.exit(0);
});

module.exports = OnlineStatusServer;
