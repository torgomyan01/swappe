# Online Status Implementation

This document describes the implementation of the online status functionality for the chat system.

## Overview

The online status system tracks when users were last active and displays their current status (online/offline) in the chat interface.

## Features

- **Real-time Status**: Shows if a user is currently online (active within last 5 minutes)
- **Last Seen Time**: Displays when a user was last active if they're offline
- **Automatic Updates**: User's last seen time is updated automatically based on activity
- **Visual Indicators**: Green dot and animation for online users
- **Responsive Design**: Works on both desktop and mobile devices

## Implementation Details

### Database Changes

1. **Added `last_seen` field to users table**:
   ```sql
   ALTER TABLE users ADD COLUMN last_seen DATETIME DEFAULT CURRENT_TIMESTAMP;
   ```

### New Files Created

1. **`src/hooks/use-online-status.ts`** - Hook for tracking user activity
2. **`src/app/actions/auth/update-last-seen.ts`** - Action to update user's last seen time
3. **`src/app/actions/chat/get-user-last-seen.ts`** - Action to get other user's last seen time

### Modified Files

1. **`src/utils/helpers.ts`** - Added online status utility functions
2. **`src/app/im/components/chat-header.tsx`** - Updated to show real online status
3. **`src/app/im/components/chat-info.tsx`** - Added online status tracking
4. **`src/app/im/_chat.scss`** - Added styles for online indicators
5. **`prisma/schema.prisma`** - Added last_seen field to users model
6. **`@types/app.d.ts`** - Updated TypeScript interfaces

## Usage

### For Developers

1. **Initialize Online Status Tracking**:

   ```tsx
   import { useOnlineStatus } from "@/hooks/use-online-status";

   function ChatComponent() {
     useOnlineStatus(); // This will start tracking user activity
     // ... rest of component
   }
   ```

2. **Get Online Status**:

   ```tsx
   import { getOnlineStatus } from "@/utils/helpers";

   const status = getOnlineStatus(user.last_seen);
   // Returns: { isOnline: boolean, statusText: string, statusClass: string }
   ```

3. **Update Last Seen Manually**:

   ```tsx
   import { ActionUpdateLastSeen } from "@/app/actions/auth/update-last-seen";

   await ActionUpdateLastSeen();
   ```

### For Users

- **Online Status**: Users are considered online if they were active within the last 5 minutes
- **Activity Tracking**: The system tracks mouse movements, clicks, keyboard input, and scrolling
- **Automatic Updates**: Status updates automatically every minute
- **Visual Feedback**: Online users show a green dot with pulsing animation

## Configuration

### Online Threshold

Users are considered online if they were active within the last 5 minutes. This can be changed in `src/utils/helpers.ts`:

```typescript
// Consider user online if they were active within last 5 minutes
if (diffMinutes <= 5) {
  // ... online logic
}
```

### Update Frequency

The system updates the user's last seen time every 2 minutes and checks status every minute. These can be adjusted in the respective files.

## Styling

The online status uses the following CSS classes:

- `.status.online` - Green color for online status
- `.status.offline` - Gray color for offline status
- `.online-indicator` - Green dot with pulsing animation

## Database Migration

To apply the database changes, run:

```sql
-- Add last_seen column to users table
ALTER TABLE users ADD COLUMN last_seen DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Update existing users to have current timestamp as last_seen
UPDATE users SET last_seen = NOW() WHERE last_seen IS NULL;
```

## Testing

1. **Test Online Status**: Open chat in two different browsers/incognito windows
2. **Test Activity Tracking**: Move mouse, click, type - status should update
3. **Test Offline Status**: Wait 5+ minutes without activity - should show "last seen" time
4. **Test Visual Indicators**: Online users should show green dot with animation

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Make sure to run `npx prisma generate` after schema changes
2. **Database Errors**: Ensure the migration script has been run
3. **Status Not Updating**: Check that the `useOnlineStatus` hook is being called
4. **Visual Issues**: Verify SCSS is compiled and styles are applied

### Debug Mode

To debug online status, check the browser console for:

- WebSocket connection status
- Activity tracking events
- API call responses

## Performance Considerations

- **Activity Tracking**: Uses throttled event listeners to avoid excessive API calls
- **Update Frequency**: Balances real-time updates with server load
- **Caching**: User status is cached and updated periodically
- **Database**: Uses indexed timestamp field for efficient queries

## Security

- **Authentication**: All status updates require valid user session
- **Authorization**: Users can only see status of users they're chatting with
- **Privacy**: Last seen time is only visible to chat participants
- **Rate Limiting**: Activity updates are throttled to prevent abuse
