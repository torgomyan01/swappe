# Real-time Online Status Implementation

## Overview

This implementation provides real-time online status functionality using WebSocket connections. Users' online/offline status updates instantly across all connected clients without requiring page refreshes.

## Architecture

### Components

1. **WebSocket Server** (`ws-online-server.js`) - Standalone WebSocket server on port 3001
2. **React Hook** (`use-realtime-online-status.ts`) - Client-side WebSocket connection management
3. **Chat Header Component** - Displays real-time status with visual indicators
4. **Test Page** (`test-realtime-status.html`) - For testing WebSocket functionality

### Flow

```
User A connects → WebSocket Server → Notifies all other users → User B sees "User A is online"
User A disconnects → WebSocket Server → Notifies all other users → User B sees "User A was online X ago"
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install concurrently ws
```

### 2. Start the Application

**Development Mode (both Next.js and WebSocket server):**

```bash
npm run dev
```

**Or start separately:**

```bash
# Terminal 1: Next.js
npm run dev:next

# Terminal 2: WebSocket Server
npm run dev:ws
```

**Production Mode:**

```bash
npm run start
```

### 3. Test the Implementation

1. **Open Test Page**: Open `test-realtime-status.html` in your browser
2. **Connect Multiple Users**: Open multiple tabs with different User IDs
3. **Test Real-time Updates**: Connect/disconnect users and watch status updates

## Features

### Real-time Status Updates

- ✅ **Instant Online Detection**: Users appear online immediately when they connect
- ✅ **Instant Offline Detection**: Users appear offline immediately when they disconnect
- ✅ **No Page Refresh Required**: Status updates happen automatically
- ✅ **Visual Indicators**: Green dot for online, gray for offline
- ✅ **Smooth Animations**: Pulsing dot animation for online users

### Technical Features

- ✅ **WebSocket Connection Management**: Automatic reconnection on disconnect
- ✅ **Heartbeat System**: Detects dead connections and cleans them up
- ✅ **Error Handling**: Graceful handling of connection errors
- ✅ **Performance Optimized**: Minimal API calls, efficient message broadcasting

## Usage in Components

### Basic Implementation

```tsx
import { useRealtimeOnlineStatus } from "@/hooks/use-realtime-online-status";

function ChatComponent() {
  const callbacks = {
    onUserOnline: (userId) => {
      console.log(`User ${userId} is now online`);
    },
    onUserOffline: (userId) => {
      console.log(`User ${userId} went offline`);
    },
    onStatusUpdate: (userId, lastSeen) => {
      console.log(`User ${userId} last seen: ${lastSeen}`);
    },
  };

  const { isConnected, reconnect } = useRealtimeOnlineStatus(callbacks);

  return (
    <div>
      <p>WebSocket Status: {isConnected ? "Connected" : "Disconnected"}</p>
      {!isConnected && <button onClick={reconnect}>Reconnect</button>}
    </div>
  );
}
```

### Advanced Implementation (Chat Header)

```tsx
const onlineStatusCallbacks = useMemo(
  () => ({
    onUserOnline: (userId) => {
      if (userId === otherUserId) {
        setRealTimeStatus({ isOnline: true });
        const status = getOnlineStatus(new Date());
        setOnlineStatus(status);
      }
    },
    onUserOffline: (userId) => {
      if (userId === otherUserId) {
        setRealTimeStatus({ isOnline: false });
        const status = getOnlineStatus(realTimeStatus?.lastSeen || new Date());
        setOnlineStatus(status);
      }
    },
    onStatusUpdate: (userId, lastSeen) => {
      if (userId === otherUserId) {
        setRealTimeStatus({ isOnline: true, lastSeen });
        const status = getOnlineStatus(lastSeen);
        setOnlineStatus(status);
      }
    },
  }),
  [otherUserId, realTimeStatus?.lastSeen],
);

useRealtimeOnlineStatus(onlineStatusCallbacks);
```

## WebSocket Server Details

### Port Configuration

- **Development**: `ws://localhost:3001`
- **Production**: `wss://yourdomain.com:3001`

### Message Types

```typescript
interface OnlineStatusMessage {
  type:
    | "USER_ONLINE"
    | "USER_OFFLINE"
    | "STATUS_UPDATE"
    | "CONNECTION_ESTABLISHED";
  userId: number;
  lastSeen?: Date;
  isOnline?: boolean;
  timestamp?: string;
}
```

### Connection URL

```
ws://localhost:3001/ws-online-status?userId=123
```

## Testing

### Manual Testing

1. **Open Multiple Browser Tabs**:
   - Tab 1: User ID 1
   - Tab 2: User ID 2
   - Tab 3: User ID 3

2. **Test Scenarios**:
   - Connect User 1 → User 2 and 3 should see "User 1 is online"
   - Disconnect User 1 → User 2 and 3 should see "User 1 was online X ago"
   - Reconnect User 1 → Status should update instantly

3. **Test Visual Indicators**:
   - Online: Green pulsing dot + "В сети"
   - Offline: Gray text + "Был в сети X назад"
   - Loading: Spinning indicator + "Загрузка..."

### Automated Testing

Use the test page (`test-realtime-status.html`) to:

- Test WebSocket connections
- Monitor real-time updates
- Simulate user activity
- Test error scenarios

## Performance Considerations

### Optimization Features

- **Debounced Updates**: Prevents spam with 30-second minimum between API calls
- **Efficient Broadcasting**: Only sends updates to relevant users
- **Connection Pooling**: Reuses WebSocket connections when possible
- **Heartbeat System**: Cleans up dead connections automatically

### Resource Usage

- **Memory**: ~1KB per connected user
- **CPU**: Minimal - only on status changes
- **Network**: ~100 bytes per status update

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**:
   - Check if WebSocket server is running on port 3001
   - Verify firewall settings
   - Check browser console for errors

2. **Status Not Updating**:
   - Verify user authentication
   - Check WebSocket connection status
   - Ensure proper callback functions are provided

3. **Multiple Connections**:
   - Each user should have only one active connection
   - Old connections are automatically cleaned up

### Debug Mode

Enable debug logging by adding to your component:

```tsx
useEffect(() => {
  console.log("WebSocket status:", isConnected);
}, [isConnected]);
```

## Security Considerations

- **Authentication**: Users must be authenticated to connect
- **Authorization**: Users can only see status of users they're chatting with
- **Rate Limiting**: Built-in protection against connection spam
- **Input Validation**: All WebSocket messages are validated

## Production Deployment

### Environment Variables

```env
NODE_ENV=production
WEBSOCKET_PORT=3001
```

### Nginx Configuration

```nginx
location /ws-online-status {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

### Docker Support

```dockerfile
# Add to your Dockerfile
COPY ws-online-server.js ./
EXPOSE 3001
CMD ["node", "ws-online-server.js"]
```

## Monitoring

### Health Checks

- WebSocket server responds to ping requests
- Connection count monitoring
- Error rate tracking

### Metrics to Monitor

- Active connections
- Messages per second
- Connection errors
- Reconnection attempts

This implementation provides a robust, real-time online status system that enhances user experience with instant status updates! 🚀
