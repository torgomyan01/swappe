const { WebSocketServer } = require("ws");
const { createServer } = require("http");

// Ultra-fast in-memory storage
const connectedUsers = new Map();
const userSessions = new Map();

class UltraFastOnlineStatusServer {
  constructor(port = 3001) {
    this.port = port;
    this.server = createServer();
    this.wss = new WebSocketServer({
      server: this.server,
      path: "/ws-online-status",
    });

    this.setupWebSocketServer();
    this.startUltraFastHeartbeat();
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
      console.log(
        `🚀 ULTRA-FAST: User ${userIdNum} connected - INSTANT STATUS`,
      );

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

      // ULTRA-FAST: Notify all other users IMMEDIATELY
      this.broadcastUserStatusUltraFast(userIdNum, true);

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("close", () => {
        console.log(
          `🔌 ULTRA-FAST: User ${userIdNum} disconnected - INSTANT OFFLINE`,
        );
        this.handleUserDisconnectUltraFast(userIdNum);
      });

      ws.on("error", (error) => {
        console.error(
          `❌ ULTRA-FAST: WebSocket error for user ${userIdNum}:`,
          error,
        );
        this.handleUserDisconnectUltraFast(userIdNum);
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

  // ULTRA-FAST broadcasting - NO DELAYS
  broadcastUserStatusUltraFast(userId, isOnline) {
    const message = {
      type: isOnline ? "USER_ONLINE" : "USER_OFFLINE",
      userId,
      timestamp: new Date().toISOString(),
      instant: true,
    };

    console.log(
      `⚡ ULTRA-FAST: User ${userId} is ${isOnline ? "ONLINE" : "OFFLINE"}`,
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

    console.log(`📡 ULTRA-FAST broadcast sent to ${broadcastCount} users`);
  }

  handleUserDisconnectUltraFast(userId) {
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

    // ULTRA-FAST: Notify all other users IMMEDIATELY
    this.broadcastUserStatusUltraFast(userId, false);
  }

  // Ultra-fast heartbeat - 10 seconds for maximum responsiveness
  startUltraFastHeartbeat() {
    setInterval(() => {
      const now = Date.now();
      connectedUsers.forEach((userClients, userId) => {
        userClients.forEach((client) => {
          if (!client.isAlive) {
            console.log(
              `💔 ULTRA-FAST: User ${userId} heartbeat failed - disconnecting`,
            );
            client.terminate();
            this.handleUserDisconnectUltraFast(userId);
            return;
          }
          client.isAlive = false;
          client.ping();
        });
      });
    }, 10000); // 10 seconds - ultra-fast for maximum responsiveness
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
        `🚀 ULTRA-FAST Online Status WebSocket server running on port ${this.port}`,
      );
      console.log(`⚡ INSTANT real-time updates enabled`);
      console.log(
        `📡 WebSocket URL: ws://localhost:${this.port}/ws-online-status`,
      );

      // Log stats every 15 seconds
      setInterval(() => {
        const stats = this.getStats();
        console.log(
          `📊 ULTRA-FAST Stats: ${stats.connectedUsers} users, ${stats.totalConnections} connections`,
        );
      }, 15000);
    });
  }

  stop() {
    this.server.close();
  }
}

// Start the ultra-fast server
const ultraFastServer = new UltraFastOnlineStatusServer();
ultraFastServer.start();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down ULTRA-FAST Online Status WebSocket server...");
  ultraFastServer.stop();
  process.exit(0);
});

module.exports = UltraFastOnlineStatusServer;
