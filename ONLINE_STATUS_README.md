# 🟢 Online Status Integration

## 📋 Overview

The WebSocket server (`ws-server.js`) now supports both real-time messaging and online status tracking. Users can see when others come online/offline in real-time.

## 🎯 Features

- **Real-time Online Status**: Track when users come online/offline
- **Message Broadcasting**: Send and receive chat/support messages
- **User Session Tracking**: Store user session information
- **Heartbeat Monitoring**: Detect disconnected clients (30-second intervals)
- **Database Integration**: Messages stored via Prisma
- **Dual Functionality**: Both messaging and status tracking in one server

## 🚀 Message Types

### 1. Online Status Messages

**User Online:**

```javascript
{
  "type": "USER_ONLINE",
  "userId": 123,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**User Offline:**

```javascript
{
  "type": "USER_OFFLINE",
  "userId": 123,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Connection Established:**

```javascript
{
  "type": "CONNECTION_ESTABLISHED",
  "userId": 123,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Chat Messages

**Send Message:**

```javascript
{
  "type": "NEW_MESSAGE",
  "chat_id": 123,
  "sender_id": 456,
  "content": "Hello world!",
  "file_type": "image/png", // optional
  "file_paths": "uploads/image.png" // optional
}
```

**Received Message:**

```javascript
{
  "type": "MESSAGE",
  "payload": {
    "id": 1,
    "chat_id": 123,
    "sender_id": 456,
    "content": "Hello world!",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### 3. Support Messages

**Send Message:**

```javascript
{
  "type": "NEW_SUPPORT_MESSAGE",
  "support_chat_id": 123,
  sender_id: 456,
  content: "I need help!",
  file_type: "text/plain" // optional
}
```

**Received Message:**

```javascript
{
  "type": "SUPPORT_MESSAGE",
  "payload": {
    "id": 1,
    "support_chat_id": 123,
    "sender_id": 456,
    "content": "I need help!",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

## 🔧 WebSocket Connection

### Connection URL

```
ws://localhost:3004?userId={USER_ID}
```

### Connection Flow

1. **Client Connects**: WebSocket connection with userId parameter
2. **User Online**: User marked as online, others notified
3. **Message Handling**: Send/receive messages and status updates
4. **Heartbeat**: Regular ping/pong to detect disconnections
5. **User Offline**: User marked as offline, others notified

## 🛠️ Testing

### 1. Start the WebSocket Server

```bash
npm run socket
```

### 2. Test Online Status

Open `test-online-status.html` in your browser to test online status functionality.

### 3. Test Features

- **Connect/Disconnect**: Test WebSocket connection
- **User ID**: Enter different user IDs to simulate multiple users
- **Online Status**: See when users come online/offline
- **Real-time Updates**: Instant status updates
- **Message Broadcasting**: Send and receive messages

## 📡 Server Features

### Online Status Tracking

- **User Sessions**: Track user connection status
- **Heartbeat System**: 30-second ping/pong to detect disconnections
- **Status Broadcasting**: Notify all users when someone comes online/offline
- **Session Management**: Store user session information in memory

### Message Handling

- **Chat Messages**: Regular chat message handling
- **Support Messages**: Support chat message handling
- **Database Storage**: Messages stored via Prisma
- **File Support**: Handle file attachments and file types
- **Broadcasting**: All connected users receive new messages

### Server Statistics

```
📊 WS Stats: 5 users, 8 connections
```

- **Connected Users**: Number of unique users
- **Total Connections**: Total WebSocket connections
- **User Sessions**: Active user sessions

## 🎮 Commands

```bash
# Start WebSocket server with both features
npm run socket

# Test online status
open test-online-status.html

# Start Next.js app (separate terminal)
npm run dev
```

## 🔄 Message Flow

### Online Status Flow

1. **User Connects**: WebSocket connection established
2. **Status Update**: User marked as online
3. **Broadcast**: All other users notified
4. **Heartbeat**: Regular ping/pong to detect disconnections
5. **User Disconnects**: Status updated and broadcasted

### Message Flow

1. **Send Message**: Client sends message with type and data
2. **Database Storage**: Message stored in database via Prisma
3. **Broadcast**: Message broadcasted to all connected clients
4. **Real-time Update**: All clients receive the message instantly

## 📝 Logging

The server provides detailed logging for both features:

```
🚀 WS: User 123 connected
📡 WS: User 123 is ONLINE
📡 WS: Broadcast sent to 5 users
📨 WS: Received message from user 123: NEW_MESSAGE
💬 WS: New message created with ID: 456
📡 WS: Message broadcast sent to 5 users
🔌 WS: User 123 disconnected
📡 WS: User 123 is OFFLINE
```

## 🔒 Security Considerations

- **User Authentication**: Verify userId parameter
- **Input Validation**: Validate message content and file types
- **Rate Limiting**: Implement connection and message rate limiting
- **File Upload**: Secure file upload handling
- **SQL Injection**: Prisma provides protection against SQL injection

## 🐛 Troubleshooting

### Common Issues

1. **User ID Required**

   ```
   WebSocket closed: 1008 - User ID required
   ```

   Solution: Always include userId parameter in connection URL

2. **Database Connection Error**

   ```
   Error: Prisma client not connected
   ```

   Solution: Ensure database is running and Prisma schema is up to date

3. **Message Not Broadcasted**
   - Check if WebSocket connection is active
   - Verify message format is correct
   - Check server logs for errors

### Debug Mode

Enable detailed logging by checking server console output and browser developer tools.

## 📚 API Reference

### Server Functions

- `broadcastUserStatus(userId, isOnline)`: Broadcast user status to all clients
- `handleUserDisconnect(userId)`: Handle user disconnection
- `startHeartbeat()`: Start heartbeat system for connection monitoring
- `prisma.messages.create()`: Create new chat message
- `prisma.support_messages.create()`: Create new support message

### Client Integration

```javascript
// Connect to WebSocket with user ID
const ws = new WebSocket("ws://localhost:3004?userId=123");

// Listen for online status updates
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.type === "USER_ONLINE") {
    console.log(`User ${message.userId} came online`);
  } else if (message.type === "USER_OFFLINE") {
    console.log(`User ${message.userId} went offline`);
  } else if (message.type === "MESSAGE") {
    console.log("New chat message:", message.payload);
  } else if (message.type === "SUPPORT_MESSAGE") {
    console.log("New support message:", message.payload);
  }
};

// Send chat message
ws.send(
  JSON.stringify({
    type: "NEW_MESSAGE",
    chat_id: 1,
    sender_id: 123,
    content: "Hello world!",
  }),
);
```

## 🎯 Next Steps

1. **User Authentication**: Implement proper user authentication
2. **Message History**: Load previous messages on connection
3. **Message Status**: Read receipts and delivery status
4. **Message Encryption**: End-to-end encryption for messages
5. **User Presence**: Show typing indicators and user activity
6. **Message Reactions**: Emoji reactions to messages

## 🔄 Integration with Frontend

The WebSocket server is designed to work with:

- **React Components**: Message input, display, and status components
- **State Management**: Redux or Context for message and status state
- **Authentication**: User authentication and authorization
- **File Upload**: File upload handling and storage
- **Real-time Updates**: Instant message delivery and status updates

---

**Note**: This WebSocket server provides both real-time messaging and online status functionality for development and testing. For production use, implement proper security, authentication, and scaling measures.
