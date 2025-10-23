import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { parse } from "url";
import { prisma } from "@/lib/prisma";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: number;
  isAlive?: boolean;
}

interface OnlineStatusMessage {
  type: "USER_ONLINE" | "USER_OFFLINE" | "STATUS_UPDATE";
  userId: number;
  lastSeen?: Date;
  isOnline?: boolean;
}

class OnlineStatusManager {
  private wss: WebSocketServer;
  private clients: Map<number, Set<AuthenticatedWebSocket>> = new Map();
  private heartbeatInterval: NodeJS.Timeout = null as any;

  constructor(server: any) {
    this.wss = new WebSocketServer({
      server,
      path: "/ws-online-status",
    });

    this.setupWebSocketServer();
    this.startHeartbeat();
  }

  private setupWebSocketServer() {
    this.wss.on(
      "connection",
      async (ws: AuthenticatedWebSocket | any, req: IncomingMessage) => {
        try {
          // Authenticate user
          const session = await this.authenticateUser(req);
          if (!session?.user?.id) {
            ws.close(1008, "Unauthorized");
            return;
          }

          ws.userId = session.user.id;
          ws.isAlive = true;

          // Add client to user's connection set
          if (!this.clients.has(ws.userId)) {
            this.clients.set(ws.userId, new Set());
          }
          this.clients.get(ws.userId)!.add(ws);

          console.log(`User ${ws.userId} connected to online status WebSocket`);

          // Update user's last seen time
          await this.updateUserLastSeen(ws.userId);

          // Notify other users that this user is online
          this.broadcastUserStatus(ws.userId, true);

          ws.on("pong", () => {
            ws.isAlive = true;
          });

          ws.on("close", () => {
            console.log(
              `User ${ws.userId} disconnected from online status WebSocket`,
            );
            this.handleUserDisconnect(ws.userId!);
          });

          ws.on("error", (error: any) => {
            console.error(`WebSocket error for user ${ws.userId}:`, error);
          });
        } catch (error) {
          console.error("WebSocket connection error:", error);
          ws.close(1008, "Authentication failed");
        }
      },
    );
  }

  private async authenticateUser(req: IncomingMessage): Promise<any> {
    // Extract session from cookies
    const cookies = req.headers.cookie;
    if (!cookies) return null;

    // This is a simplified authentication - in production you'd want proper session handling
    try {
      // For now, we'll use a different approach - get user from query params
      const url = parse(req.url!, true);
      const userId = url.query.userId;

      if (!userId) return null;

      // Verify user exists
      const user = await prisma.users.findUnique({
        where: { id: parseInt(userId as string) },
        select: { id: true, name: true },
      });

      return user ? { user } : null;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }

  private async updateUserLastSeen(userId: number) {
    try {
      await prisma.users.update({
        where: { id: userId },
        data: { last_seen: new Date() },
      });
    } catch (error) {
      console.error("Error updating last seen:", error);
    }
  }

  private broadcastUserStatus(userId: number, isOnline: boolean) {
    const message: OnlineStatusMessage = {
      type: isOnline ? "USER_ONLINE" : "USER_OFFLINE",
      userId,
      isOnline,
    };

    // Broadcast to all connected clients except the user themselves
    this.clients.forEach((userClients, clientUserId) => {
      if (clientUserId !== userId) {
        userClients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      }
    });
  }

  private handleUserDisconnect(userId: number) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete = () => false; // Clear the set
      this.clients.delete(userId);
    }

    // Notify other users that this user went offline
    this.broadcastUserStatus(userId, false);
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((userClients, userId) => {
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

  public broadcastStatusUpdate(userId: number, lastSeen: Date) {
    const message: OnlineStatusMessage = {
      type: "STATUS_UPDATE",
      userId,
      lastSeen,
    };

    this.clients.forEach((userClients) => {
      userClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    });
  }

  public destroy() {
    clearInterval(this.heartbeatInterval);
    this.wss.close();
  }
}

let onlineStatusManager: OnlineStatusManager | null = null;

export function initializeOnlineStatusServer(server: any) {
  if (!onlineStatusManager) {
    onlineStatusManager = new OnlineStatusManager(server);
  }
  return onlineStatusManager;
}

export function getOnlineStatusManager() {
  return onlineStatusManager;
}
