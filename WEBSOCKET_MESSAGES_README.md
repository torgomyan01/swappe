# 💬 WebSocket Messages Integration

## 📋 Overview

The WebSocket server (`ws-server.js`) now supports real-time message handling for both regular chat messages and support messages. It integrates with Prisma to store messages in the database and broadcasts them to all connected clients.

## 🎯 Features

- **Real-time Chat Messages**: Send and receive chat messages instantly
- **Support Messages**: Handle support chat messages
- **Database Integration**: Messages stored in database via Prisma
- **Broadcast System**: All connected users receive new messages
- **File Support**: Handle file attachments and file types
- **Error Handling**: Comprehensive error handling and logging

## 🚀 Message Types

### 1. Chat Messages

**Send Message:**

```javascript
{
  "type": "NEW_MESSAGE",
  "chat_id": 123,
  "sender_id": 456,
  "content": "Hello world!",
  "file_type": "image/png", // optional
  "file_paths": "uploads/image.png", // optional
  "selected_chat_id": 789 // optional
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
    "file_type": "image/png",
    "file_paths": "uploads/image.png",
    "selected_chat_id": 789,
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### 2. Support Messages

**Send Message:**

```javascript
{
  "type": "NEW_SUPPORT_MESSAGE",
  "support_chat_id": 123,
  "sender_id": 456,
  "content": "I need help with my account",
  "file_type": "text/plain", // optional
  "file_paths": "uploads/screenshot.png" // optional
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
    "content": "I need help with my account",
    "file_type": "text/plain",
    "file_paths": "uploads/screenshot.png",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

## 🔧 Database Schema

The WebSocket server expects the following Prisma schema:

```prisma
model messages {
  id              Int      @id @default(autoincrement())
  chat_id         Int
  sender_id       Int
  content         String
  file_type       String?
  file_paths      String?
  selected_chat_id Int?
  created_at      DateTime @default(now())
}

model support_messages {
  id              Int      @id @default(autoincrement())
  support_chat_id Int
  sender_id       Int
  content         String
  file_type       String?
  file_paths      String?
  created_at      DateTime @default(now())
}
```

## 🛠️ Testing

### 1. Start the WebSocket Server

```bash
npm run socket
```

### 2. Test Messages

Open `test-messages-websocket.html` in your browser to test message functionality.

### 3. Test Features

- **Connect/Disconnect**: Test WebSocket connection
- **Send Chat Messages**: Send regular chat messages
- **Send Support Messages**: Send support messages
- **Real-time Updates**: See messages appear instantly
- **File Attachments**: Test file type and file paths

## 📡 WebSocket Connection

### Connection URL

```
ws://localhost:3001/ws-online-status?userId={USER_ID}
```

### Message Flow

1. **Client Connects**: WebSocket connection established
2. **Send Message**: Client sends message with type and data
3. **Database Storage**: Message stored in database via Prisma
4. **Broadcast**: Message broadcasted to all connected clients
5. **Real-time Update**: All clients receive the message instantly

## 🔄 Message Broadcasting

The server uses `broadcastToAllClients()` method to send messages to all connected users:

```javascript
// Broadcast to all connected clients
this.broadcastToAllClients({
  type: "MESSAGE",
  payload: newMessage,
});
```

## 📝 Logging

The server provides detailed logging for message handling:

```
📨 WS: Received message from user 123: NEW_MESSAGE
💬 WS: New message created with ID: 456
📡 WS: Message broadcast sent to 5 users
🆘 WS: New support message created with ID: 789
```

## 🎮 Commands

```bash
# Start WebSocket server with message support
npm run socket

# Test message functionality
open test-messages-websocket.html

# Start Next.js app (separate terminal)
npm run dev
```

## 🔒 Security Considerations

- **Input Validation**: Validate message content and file types
- **User Authentication**: Verify sender_id matches authenticated user
- **Rate Limiting**: Implement message rate limiting
- **File Upload**: Secure file upload handling
- **SQL Injection**: Prisma provides protection against SQL injection

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**

   ```
   Error: Prisma client not connected
   ```

   Solution: Ensure database is running and Prisma schema is up to date

2. **Message Not Broadcasted**
   - Check if WebSocket connection is active
   - Verify message format is correct
   - Check server logs for errors

3. **Database Insert Error**
   - Verify Prisma schema matches database
   - Check required fields are provided
   - Ensure foreign key constraints are met

### Debug Mode

Enable detailed logging by checking server console output and browser developer tools.

## 📚 API Reference

### Server Methods

- `broadcastToAllClients(message)`: Broadcast message to all clients
- `handleMessage(data)`: Handle incoming message and store in database
- `prisma.messages.create()`: Create new chat message
- `prisma.support_messages.create()`: Create new support message

### Client Integration

```javascript
// Connect to WebSocket
const ws = new WebSocket("ws://localhost:3001/ws-online-status?userId=123");

// Send chat message
ws.send(
  JSON.stringify({
    type: "NEW_MESSAGE",
    chat_id: 1,
    sender_id: 123,
    content: "Hello world!",
  }),
);

// Send support message
ws.send(
  JSON.stringify({
    type: "NEW_SUPPORT_MESSAGE",
    support_chat_id: 1,
    sender_id: 123,
    content: "I need help!",
  }),
);

// Listen for messages
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === "MESSAGE") {
    console.log("New chat message:", message.payload);
  } else if (message.type === "SUPPORT_MESSAGE") {
    console.log("New support message:", message.payload);
  }
};
```

## 🎯 Next Steps

1. **Message History**: Load previous messages on connection
2. **Message Status**: Read receipts and delivery status
3. **Message Encryption**: End-to-end encryption for messages
4. **Message Search**: Search through message history
5. **Message Reactions**: Emoji reactions to messages
6. **Message Threading**: Reply to specific messages

## 🔄 Integration with Frontend

The WebSocket server is designed to work with:

- **React Components**: Message input and display components
- **State Management**: Redux or Context for message state
- **Authentication**: User authentication and authorization
- **File Upload**: File upload handling and storage
- **Real-time Updates**: Instant message delivery

---

**Note**: This WebSocket server provides real-time message functionality for development and testing. For production use, implement proper security, authentication, and scaling measures.
