const { WebSocketServer } = require("ws");
const { createServer } = require("http");

// Optimized in-memory storage with minimal memory footprint
const connectedUsers = new Map();
const userSessions = new Map();

class OptimizedOnlineStatusServer {
  constructor(port = 3001) {
    this.port = port;
    this.server = createServer();
    this.wss = new WebSocketServer({
      server: this.server,
      path: "/ws-online-status",
    });

    this.setupWebSocketServer();
    this.startOptimizedHeartbeat();
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
      console.log(`🚀 User ${userIdNum} connected - INSTANT ONLINE STATUS`);

      // Store user connection
      if (!connectedUsers.has(userIdNum)) {
        connectedUsers.set(userIdNum, new Set());
      }
      connectedUsers.get(userIdNum).add(ws);

      // Update session info with current timestamp
      userSessions.set(userIdNum, {
        lastSeen: new Date(),
        isOnline: true,
        connectedAt: new Date(),
      });

      // INSTANT: Notify all other users immediately
      this.broadcastUserStatusInstant(userIdNum, true);

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("close", () => {
        console.log(`🔌 User ${userIdNum} disconnected - INSTANT OFFLINE`);
        this.handleUserDisconnectInstant(userIdNum);
      });

      ws.on("error", (error) => {
        console.error(`❌ WebSocket error for user ${userIdNum}:`, error);
        this.handleUserDisconnectInstant(userIdNum);
      });

      // Send instant connection confirmation
      ws.send(
        JSON.stringify({
          type: "CONNECTION_ESTABLISHED",
          userId: userIdNum,
          timestamp: new Date().toISOString(),
          instant: true,
        }),
      );
    });
  }

  // INSTANT broadcasting - no delays
  broadcastUserStatusInstant(userId, isOnline) {
    const message = {
      type: isOnline ? "USER_ONLINE" : "USER_OFFLINE",
      userId,
      timestamp: new Date().toISOString(),
      instant: true,
    };

    console.log(
      `⚡ INSTANT: User ${userId} is ${isOnline ? "ONLINE" : "OFFLINE"}`,
    );

    // Broadcast to ALL connected users except the user themselves
    let broadcastCount = 0;
    connectedUsers.forEach((userClients, clientUserId) => {
      if (clientUserId !== userId) {
        userClients.forEach((client) => {
          if (client.readyState === 1) {
            // WebSocket.OPEN
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

    console.log(`📡 INSTANT broadcast sent to ${broadcastCount} users`);
  }

  handleUserDisconnectInstant(userId) {
    const userClients = connectedUsers.get(userId);
    if (userClients) {
      userClients.clear();
      connectedUsers.delete(userId);
    }

    // Update session info instantly
    if (userSessions.has(userId)) {
      userSessions.set(userId, {
        ...userSessions.get(userId),
        isOnline: false,
        lastSeen: new Date(),
        disconnectedAt: new Date(),
      });
    }

    // INSTANT: Notify all other users immediately
    this.broadcastUserStatusInstant(userId, false);
  }

  // Optimized heartbeat - less frequent but more reliable
  startOptimizedHeartbeat() {
    setInterval(() => {
      const now = Date.now();
      connectedUsers.forEach((userClients, userId) => {
        userClients.forEach((client) => {
          if (!client.isAlive) {
            console.log(`💔 User ${userId} heartbeat failed - disconnecting`);
            client.terminate();
            this.handleUserDisconnectInstant(userId);
            return;
          }
          client.isAlive = false;
          client.ping();
        });
      });
    }, 15000); // 15 seconds - more frequent for better real-time
  }

  // Get real-time stats
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
      console.log(
        `🚀 OPTIMIZED Online Status WebSocket server running on port ${this.port}`,
      );
      console.log(`⚡ INSTANT real-time updates enabled`);
      console.log(
        `📡 WebSocket URL: ws://localhost:${this.port}/ws-online-status`,
      );

      // Log stats every 30 seconds
      setInterval(() => {
        const stats = this.getStats();
        console.log(
          `📊 Stats: ${stats.connectedUsers} users, ${stats.totalConnections} connections`,
        );
      }, 30000);
    });
  }

  stop() {
    this.server.close();
  }
}

// Start the optimized server
const optimizedServer = new OptimizedOnlineStatusServer();
optimizedServer.start();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down OPTIMIZED Online Status WebSocket server...");
  optimizedServer.stop();
  process.exit(0);
});

module.exports = OptimizedOnlineStatusServer;
