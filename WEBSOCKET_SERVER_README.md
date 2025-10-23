# 🚀 WebSocket Server for Real-time Online Status

## 📋 Overview

This WebSocket server (`ws-server.js`) provides real-time online status functionality for the chat application. It runs independently and handles user connections, status updates, and broadcasts.

## 🎯 Features

- **Real-time Online Status**: Track when users come online/offline
- **Connection Management**: Handle multiple connections per user
- **Heartbeat Monitoring**: Detect disconnected clients (30-second intervals)
- **Status Broadcasting**: Notify all users when someone comes online/offline
- **Session Tracking**: Store user session information in memory
- **Graceful Shutdown**: Clean shutdown on SIGINT

## 🚀 Quick Start

### 1. Start the WebSocket Server

```bash
# Start the WebSocket server
npm run socket

# Or directly
node ws-server.js
```

### 2. Test the Connection

Open `test-simple-websocket.html` in your browser to test the WebSocket connection.

## 📡 WebSocket Connection

### Connection URL

```
ws://localhost:3001/ws-online-status?userId={USER_ID}
```

### Message Types

#### 1. CONNECTION_ESTABLISHED

```json
{
  "type": "CONNECTION_ESTABLISHED",
  "userId": 123,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "connectionId": "123-1704110400000"
}
```

#### 2. USER_ONLINE

```json
{
  "type": "USER_ONLINE",
  "userId": 123,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### 3. USER_OFFLINE

```json
{
  "type": "USER_OFFLINE",
  "userId": 123,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🔧 Configuration

### Port

- Default: `3001`
- Change in `ws-server.js`: `new SimpleWebSocketServer(3001)`

### Heartbeat Interval

- Default: `30 seconds`
- Change in `startHeartbeat()` method

### Stats Logging

- Default: Every `30 seconds`
- Change in `start()` method

## 📊 Server Statistics

The server logs statistics every 30 seconds:

```
📊 WS Stats: 5 users, 8 connections
```

- **Connected Users**: Number of unique users
- **Total Connections**: Total WebSocket connections
- **User Sessions**: Active user sessions

## 🛠️ Development

### Testing

1. Start the server: `npm run socket`
2. Open `test-simple-websocket.html` in browser
3. Click "Connect" to test the connection
4. Check console logs for real-time updates

### Integration

The WebSocket server is designed to work with:

- Frontend: React hooks for status management
- Backend: Server actions for database updates
- Database: Prisma for user data

## 🔒 Security Notes

- **No Authentication**: Currently no user authentication
- **No Rate Limiting**: No connection rate limiting
- **Memory Storage**: All data stored in memory (not persistent)
- **CORS**: No CORS restrictions (development only)

## 🚨 Production Considerations

For production deployment:

1. **Authentication**: Add user authentication
2. **Rate Limiting**: Implement connection limits
3. **Persistent Storage**: Use Redis or database for sessions
4. **SSL/TLS**: Use WSS for secure connections
5. **Load Balancing**: Multiple server instances
6. **Monitoring**: Add health checks and metrics

## 📝 Logs

The server provides detailed logging:

```
🚀 WS: User 123 connected
📡 WS: User 123 is ONLINE
📡 WS: Broadcast sent to 5 users
🔌 WS: User 123 disconnected
💔 WS: User 123 heartbeat failed - disconnecting
```

## 🎮 Commands

```bash
# Start WebSocket server
npm run socket

# Start Next.js app (separate terminal)
npm run dev

# Test WebSocket connection
open test-simple-websocket.html
```

## 🔄 Message Flow

1. **User Connects**: WebSocket connection established
2. **Status Update**: User marked as online
3. **Broadcast**: All other users notified
4. **Heartbeat**: Regular ping/pong to detect disconnections
5. **User Disconnects**: Status updated and broadcasted

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   Error: listen EADDRINUSE: address already in use :::3001
   ```

   Solution: Kill existing process or change port

2. **Connection Refused**
   - Check if server is running
   - Verify port 3001 is available
   - Check firewall settings

3. **No Messages Received**
   - Verify WebSocket URL format
   - Check browser console for errors
   - Ensure server is running

### Debug Mode

Enable detailed logging by modifying the server code or using browser developer tools.

## 📚 API Reference

### Server Methods

- `start()`: Start the WebSocket server
- `stop()`: Stop the server gracefully
- `getStats()`: Get current server statistics
- `broadcastUserStatus(userId, isOnline)`: Broadcast status to all users
- `handleUserDisconnect(userId)`: Handle user disconnection

### Client Integration

```javascript
const ws = new WebSocket("ws://localhost:3001/ws-online-status?userId=123");

ws.onopen = () => console.log("Connected");
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("Received:", message);
};
ws.onclose = () => console.log("Disconnected");
```

## 🎯 Next Steps

1. **Add Authentication**: Implement user authentication
2. **Database Integration**: Store sessions in database
3. **Message Broadcasting**: Add chat message broadcasting
4. **File Sharing**: Real-time file sharing
5. **Video Calls**: WebRTC integration
6. **Mobile Support**: React Native integration

---

**Note**: This WebSocket server is designed for development and testing. For production use, implement proper security, authentication, and scaling measures.
