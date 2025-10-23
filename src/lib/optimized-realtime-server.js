const { WebSocketServer } = require("ws");
const { createServer } = require("http");

// Optimized in-memory storage
const connectedUsers = new Map();
const userSessions = new Map();
const connectionTimeouts = new Map();

class OptimizedRealtimeServer {
  constructor(port = 3001) {
    this.port = port;
    this.server = createServer();
    this.wss = new WebSocketServer({
      server: this.server,
      path: "/ws-online-status",
    });

    this.setupWebSocketServer();
    this.startHeartbeat();
    this.startConnectionTimeout();
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
      console.log(`🚀 REALTIME: User ${userIdNum} connected`);

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
        connectionId: Math.random().toString(36).substr(2, 9),
      });

      // Set connection timeout (5 minutes)
      this.setConnectionTimeout(userIdNum);

      // Notify all other users
      this.broadcastUserStatus(userIdNum, true);

      ws.on("pong", () => {
        ws.isAlive = true;
        // Reset timeout on pong
        this.setConnectionTimeout(userIdNum);
      });

      ws.on("close", () => {
        console.log(`🔌 REALTIME: User ${userIdNum} disconnected`);
        this.handleUserDisconnect(userIdNum);
      });

      ws.on("error", (error) => {
        console.error(
          `❌ REALTIME: WebSocket error for user ${userIdNum}:`,
          error,
        );
        this.handleUserDisconnect(userIdNum);
      });

      // Send connection confirmation
      ws.send(
        JSON.stringify({
          type: "CONNECTION_ESTABLISHED",
          userId: userIdNum,
          timestamp: new Date().toISOString(),
          connectionId: userSessions.get(userIdNum).connectionId,
        }),
      );
    });
  }

  setConnectionTimeout(userId) {
    // Clear existing timeout
    if (connectionTimeouts.has(userId)) {
      clearTimeout(connectionTimeouts.get(userId));
    }

    // Set new timeout (5 minutes)
    const timeout = setTimeout(
      () => {
        console.log(`⏰ REALTIME: Connection timeout for user ${userId}`);
        this.handleUserDisconnect(userId);
      },
      5 * 60 * 1000,
    ); // 5 minutes

    connectionTimeouts.set(userId, timeout);
  }

  broadcastUserStatus(userId, isOnline) {
    const message = {
      type: isOnline ? "USER_ONLINE" : "USER_OFFLINE",
      userId,
      timestamp: new Date().toISOString(),
    };

    console.log(
      `📡 REALTIME: User ${userId} is ${isOnline ? "ONLINE" : "OFFLINE"}`,
    );

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

    console.log(`📡 REALTIME: Broadcast sent to ${broadcastCount} users`);
  }

  handleUserDisconnect(userId) {
    const userClients = connectedUsers.get(userId);
    if (userClients) {
      userClients.clear();
      connectedUsers.delete(userId);
    }

    // Clear connection timeout
    if (connectionTimeouts.has(userId)) {
      clearTimeout(connectionTimeouts.get(userId));
      connectionTimeouts.delete(userId);
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
              `💔 REALTIME: User ${userId} heartbeat failed - disconnecting`,
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

  startConnectionTimeout() {
    // Check for stale connections every minute
    setInterval(() => {
      const now = Date.now();
      connectedUsers.forEach((userClients, userId) => {
        const session = userSessions.get(userId);
        if (session && session.connectedAt) {
          const connectionAge = now - session.connectedAt.getTime();
          if (connectionAge > 10 * 60 * 1000) {
            // 10 minutes
            console.log(
              `⏰ REALTIME: Stale connection for user ${userId} - disconnecting`,
            );
            this.handleUserDisconnect(userId);
          }
        }
      });
    }, 60000); // Check every minute
  }

  getStats() {
    return {
      connectedUsers: connectedUsers.size,
      totalConnections: Array.from(connectedUsers.values()).reduce(
        (sum, clients) => sum + clients.size,
        0,
      ),
      userSessions: userSessions.size,
      activeTimeouts: connectionTimeouts.size,
    };
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`🚀 REALTIME: WebSocket server running on port ${this.port}`);
      console.log(`⚡ Real-time online status enabled`);
      console.log(
        `📡 WebSocket URL: ws://localhost:${this.port}/ws-online-status`,
      );

      // Log stats every 30 seconds
      setInterval(() => {
        const stats = this.getStats();
        console.log(
          `📊 REALTIME Stats: ${stats.connectedUsers} users, ${stats.totalConnections} connections, ${stats.activeTimeouts} timeouts`,
        );
      }, 30000);
    });
  }

  stop() {
    this.server.close();
  }
}

// Start the optimized server
const realtimeServer = new OptimizedRealtimeServer();
realtimeServer.start();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down REALTIME WebSocket server...");
  realtimeServer.stop();
  process.exit(0);
});

module.exports = OptimizedRealtimeServer;
