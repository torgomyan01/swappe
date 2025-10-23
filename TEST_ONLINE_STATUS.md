# Online Status Testing Guide

## Quick Test Steps

### 1. Database Setup

First, make sure the database migration has been run:

```sql
ALTER TABLE users ADD COLUMN last_seen DATETIME DEFAULT CURRENT_TIMESTAMP;
UPDATE users SET last_seen = NOW() WHERE last_seen IS NULL;
```

### 2. Test the API Endpoints

**Test Update Last Seen:**

```bash
curl -X POST http://localhost:3000/api/auth/update-last-seen \
  -H "Content-Type: application/json" \
  -H "Cookie: [your-session-cookie]"
```

**Test Get User Last Seen:**

```bash
curl "http://localhost:3000/api/chat/get-user-last-seen?userId=1" \
  -H "Cookie: [your-session-cookie]"
```

### 3. Test in Browser

1. **Open Chat in Two Browsers:**
   - Browser 1: Login as User A
   - Browser 2: Login as User B (or incognito mode)
   - Open the same chat in both browsers

2. **Test Activity Tracking:**
   - Move mouse around in Browser 1
   - Click and type in Browser 1
   - Check if Browser 2 shows User A as "В сети" (Online)

3. **Test Offline Status:**
   - Wait 5+ minutes without activity in Browser 1
   - Check if Browser 2 shows "Был в сети X назад" (Last seen X ago)

4. **Test Visual Indicators:**
   - Online users should show green pulsing dot
   - Loading should show spinning indicator
   - Offline users should show gray text

### 4. Expected Behavior

✅ **Online Status (within 5 minutes of activity):**

- Green pulsing dot
- "В сети" text
- Green color

✅ **Offline Status (5+ minutes since last activity):**

- No dot
- "Был в сети X назад" text
- Gray color

✅ **Loading State:**

- Spinning indicator
- "Загрузка..." text

✅ **Error State:**

- "Ошибка загрузки" text
- Gray color

### 5. Console Logs to Check

Look for these console messages:

- `"User last seen data"` - API response data
- `"Failed to update last seen:"` - Update errors
- `"Failed to get user last seen:"` - Fetch errors

### 6. Network Tab

Check the Network tab in DevTools for:

- `POST /api/auth/update-last-seen` - Should be called every 30 seconds
- `GET /api/chat/get-user-last-seen?userId=X` - Should be called when chat loads

### 7. Troubleshooting

**If you see "headers was called outside a request scope":**

- This means the old server actions are still being called
- Make sure you've updated all components to use the new API routes

**If status doesn't update:**

- Check if the database migration was run
- Verify the API endpoints are working
- Check browser console for errors

**If visual indicators don't show:**

- Make sure SCSS is compiled
- Check if CSS classes are applied correctly
- Verify the component is receiving the correct data

### 8. Performance Notes

- API calls are debounced to prevent spam (30 seconds minimum between calls)
- Status updates every 5 minutes automatically
- Activity tracking includes: mouse, keyboard, scroll, touch events
- Visual updates happen every minute for real-time feel
