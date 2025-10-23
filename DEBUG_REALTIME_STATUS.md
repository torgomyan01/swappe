# Debug Real-time Online Status

## Problem

Real-time status չի թարմանում երբ օգտատերը մուտք է գործում կայք: Status-ը մնում է "Был в сети 17 мин. назад" և չի փոփոխվում:

## Solution Steps

### 1. Start WebSocket Server

**Terminal 1: Start WebSocket Server**

```bash
npm run dev:ws
```

You should see:

```
🚀 Online Status WebSocket server running on port 3001
📡 WebSocket URL: ws://localhost:3001/ws-online-status
```

**Terminal 2: Start Next.js**

```bash
npm run dev:next
```

### 2. Test WebSocket Connection

Open `test-websocket-connection.html` in your browser and:

1. Enter User ID (e.g., 1)
2. Click "Connect"
3. Check if you see "✅ WebSocket connected successfully"
4. Open another tab with different User ID (e.g., 2)
5. Connect both users
6. Disconnect one user and watch the other tab

### 3. Test in Chat Application

1. **Open Chat in Two Browsers:**
   - Browser 1: Login as User A, open chat with User B
   - Browser 2: Login as User B, open chat with User A

2. **Check Console Logs:**
   - Look for: `🔗 Connected to online status WebSocket`
   - Look for: `📨 Received WebSocket message:`
   - Look for: `🟢 Real-time: User X came ONLINE`

3. **Test Real-time Updates:**
   - User A connects → User B should see "В сети" immediately
   - User A disconnects → User B should see "Был в сети X назад"

### 4. Debug Steps

#### Check WebSocket Server

```bash
# Check if server is running
curl http://localhost:3001
# Should return connection error (expected for WebSocket server)
```

#### Check Browser Console

Look for these messages:

- `🔗 Connected to online status WebSocket`
- `📨 Received WebSocket message:`
- `🟢 Real-time: User X came ONLINE`
- `🔴 Real-time: User X went OFFLINE`

#### Check Network Tab

1. Open DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. Look for connection to `ws://localhost:3001/ws-online-status`
4. Check if connection is established

### 5. Common Issues & Solutions

#### Issue 1: WebSocket Server Not Running

**Symptoms:** No console logs, connection errors
**Solution:**

```bash
npm run dev:ws
```

#### Issue 2: Wrong Port

**Symptoms:** Connection refused errors
**Solution:** Check if server is running on port 3001

```bash
netstat -an | grep 3001
```

#### Issue 3: CORS Issues

**Symptoms:** WebSocket connection fails
**Solution:** Make sure you're using `ws://localhost:3001` (not https)

#### Issue 4: User ID Mismatch

**Symptoms:** Status not updating for specific user
**Solution:** Check if `otherUserId` is correct in chat header

### 6. Manual Testing

#### Test 1: Basic Connection

```javascript
// In browser console
const ws = new WebSocket("ws://localhost:3001/ws-online-status?userId=1");
ws.onopen = () => console.log("Connected");
ws.onmessage = (e) => console.log("Message:", JSON.parse(e.data));
```

#### Test 2: Multiple Users

1. Open 3 browser tabs
2. Connect as User 1, 2, 3
3. Disconnect User 2
4. Check if User 1 and 3 see User 2 as offline

#### Test 3: Chat Integration

1. Open chat between User A and User B
2. Check console for WebSocket messages
3. User A connects → User B should see "В сети"
4. User A disconnects → User B should see "Был в сети X назад"

### 7. Expected Behavior

#### When User Connects:

1. WebSocket server logs: `🔗 User X connected`
2. Other users receive: `USER_ONLINE` message
3. Chat header updates: "В сети" with green dot

#### When User Disconnects:

1. WebSocket server logs: `🔌 User X disconnected`
2. Other users receive: `USER_OFFLINE` message
3. Chat header updates: "Был в сети X назад" with gray text

### 8. Debug Commands

```bash
# Check if WebSocket server is running
lsof -i :3001

# Check WebSocket connections
netstat -an | grep 3001

# Test WebSocket connection
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Key: test" -H "Sec-WebSocket-Version: 13" http://localhost:3001/ws-online-status
```

### 9. Production Deployment

For production, you'll need to:

1. Use `wss://` instead of `ws://`
2. Configure reverse proxy (nginx)
3. Handle SSL certificates
4. Use environment variables for ports

### 10. Success Indicators

✅ **WebSocket Server Running:**

```
🚀 Online Status WebSocket server running on port 3001
```

✅ **Client Connected:**

```
🔗 Connected to online status WebSocket
```

✅ **Real-time Updates:**

```
🟢 Real-time: User X came ONLINE
✅ Updated status for user X: {isOnline: true, statusText: "В сети"}
```

✅ **Visual Updates:**

- Green dot appears for online users
- Status text changes to "В сети"
- No page refresh needed

If you see all these indicators, the real-time online status is working correctly! 🎉
