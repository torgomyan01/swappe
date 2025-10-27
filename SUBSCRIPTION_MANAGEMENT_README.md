# Subscription Management System

This system automatically manages user subscription lifecycle, sending notifications, auto-renewing subscriptions, and handling downgrades.

## Features

### 1. **Daily Subscription Check (Cron Job)**

- **When**: Runs daily at 9 AM (Moscow time)
- **What it does**:
  - Checks all users with paid subscriptions
  - Identifies subscriptions expiring in 3, 2, or 1 days
  - Sends push notifications for insufficient balance
  - Auto-renews subscriptions when balance is sufficient
  - Downgrades users to free plan when subscription expires and balance is insufficient

### 2. **Push Notifications**

Users receive notifications in these scenarios:

- **3, 2, or 1 days before expiration**: If balance is insufficient
- **After auto-renewal**: Confirmation of successful renewal with amount deducted
- **After downgrade**: Notification that subscription ended and they were moved to free plan

### 3. **Auto-Renewal**

When a subscription expires:

- If balance ≥ subscription price: Automatically extends by 1 month and deducts from balance
- If balance < subscription price: Downgrades to free plan

### 4. **Access Restrictions**

When a user is downgraded to free:

- **Chat messages blocked**: Cannot send messages in deals
- **Deal creation blocked**: Cannot create new deals
- **Notification shown**: User sees message to activate a paid plan

## Implementation Details

### Files Created/Modified

1. **`src/app/api/cron/subscription-management/route.ts`**
   - Cron endpoint that runs daily at 9 AM
   - Handles subscription expiration logic
   - Sends notifications

2. **`ws-server.js`**
   - Updated to check user subscription before allowing messages
   - Returns `SUBSCRIPTION_REQUIRED` error if user doesn't have active paid subscription

3. **`src/app/im/components/chat-info.tsx`**
   - Handles `SUBSCRIPTION_REQUIRED` messages from WebSocket
   - Shows error to user in chat

4. **`src/app/im/components/message-input.tsx`**
   - Displays subscription error message
   - Provides link to activate plan

5. **`vercel.json`**
   - Added cron configuration
   - Schedule: `0 9 * * *` (9 AM daily)

6. **`src/utils/check-user-subscription.ts`**
   - Utility function to check if user has active subscription

### Environment Variables Required

Add to your `.env.local` file:

```bash
# For local development (allows testing without authentication)
DEV_BYPASS_CRON_AUTH=true

# Production cron secret (generate a random string)
CRON_SECRET=your_random_secret_key_here
```

For production (Vercel), you must set:

- `CRON_SECRET`: A random string to protect the cron endpoint
  - To generate: `openssl rand -hex 32`
- Remove or set `DEV_BYPASS_CRON_AUTH=false` for production

This setup allows testing locally without the auth check, while keeping production secure.

## How It Works

### Subscription Expiration Flow

```
User has paid subscription
    ↓
Check days remaining (3, 2, 1)
    ↓
Insufficient balance?
    ├─ YES → Send notification
    └─ NO → Wait until expiration
    ↓
Subscription expires
    ↓
Check balance
    ├─ Sufficient → Auto-renew for 1 month
    └─ Insufficient → Downgrade to free
    ↓
Restrict chat and deals
```

### Chat Blocking

When a user tries to send a message:

1. WebSocket server checks subscription status
2. If no active paid subscription → block message
3. Send `SUBSCRIPTION_REQUIRED` error
4. User sees notification in chat UI
5. User can click "Активировать план" to upgrade

## Testing

### Test Locally

1. Start the development server:

```bash
npm run dev
```

2. Trigger the cron job manually:

```bash
curl http://localhost:3000/api/cron/subscription-management
```

Note: Add the `CRON_SECRET` header for production:

```bash
curl -H "Authorization: Bearer your_secret_key_here" \
  http://localhost:3000/api/cron/subscription-management
```

### Production Deployment

On Vercel, the cron job will automatically run at 9 AM daily.

To test in production:

1. Check Vercel logs for cron execution
2. Verify push notifications are received
3. Check database for updated user subscriptions

## Monitoring

Check the following to ensure the system is working:

1. **Vercel Cron Logs**: Monitor successful executions
2. **Database Updates**: Check `users` table for subscription changes
3. **Push Notifications**: Verify users are receiving notifications
4. **User Complaints**: Monitor if users report being downgraded unexpectedly

## Configuration

### Cron Schedule

Currently set to: `0 9 * * *` (9 AM daily)

To change the schedule, edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/subscription-management",
      "schedule": "0 9 * * *" // Change this to desired schedule
    }
  ]
}
```

### Notification Timing

Notifications are sent when:

- 3 days before expiration
- 2 days before expiration
- 1 day before expiration

To modify this logic, edit `handleExpiringSubscription()` in the cron route.

## Troubleshooting

### Cron Not Running

1. Check Vercel project settings
2. Verify `vercel.json` is committed to repository
3. Check CRON_SECRET is set in environment variables

### Notifications Not Received

1. Check push notification creation in database
2. Verify `ActionCreatePushNotification` is working
3. Check user preferences for receiving notifications

### Users Not Being Downgraded

1. Verify cron is running successfully
2. Check database for correct subscription dates
3. Review logs for errors in `handleExpiredSubscription()`

## Maintenance

The cron job should run continuously without intervention. Monitor:

- Execution logs
- Error rates
- User subscription status
- Push notification delivery
