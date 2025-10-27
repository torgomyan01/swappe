# Ubuntu Cron Setup for Subscription Management

This guide explains how to set up automatic subscription management on an Ubuntu server.

## Prerequisites

1. Your Next.js application must be running and accessible
2. You have SSH access to the Ubuntu server
3. Node.js is installed on the server

## Setup Steps

### 1. Create the Cron Script

The file `subscription-cron.js` is already created in your project root. This script will call your API endpoint.

### 2. Set Environment Variables

Add to your `.env.local` (for development) or `.env` (for production):

```bash
# Generate a strong random secret for production
CRON_SECRET=your_strong_random_secret_here

# Your site URL (change to your production URL)
SITE_URL=https://yourdomain.com
```

To generate a strong secret:

```bash
openssl rand -hex 32
```

### 3. Make the Script Executable

```bash
chmod +x subscription-cron.js
```

### 4. Configure Cron Job

Open the crontab editor:

```bash
crontab -e
```

Add this line to run the cron job at 9 AM every day:

```bash
# Subscription management - runs daily at 9 AM
0 9 * * * cd /path/to/your/project/swappe && node subscription-cron.js >> /var/log/subscription-cron.log 2>&1
```

Replace `/path/to/your/project/swappe` with the actual path to your project.

### 5. Verify Cron Job

To see your cron jobs:

```bash
crontab -l
```

To test the cron job manually:

```bash
cd /path/to/your/project/swappe
node subscription-cron.js
```

## Testing

### Test the API Endpoint Directly

If you want to skip authentication in development:

```bash
# Add to .env.local
DEV_BYPASS_CRON_AUTH=true

# Then call the endpoint
curl http://localhost:3003/api/cron/subscription-management
```

### Test the Cron Script

```bash
node subscription-cron.js
```

You should see:

```
🔄 Executing subscription management cron at 2024-01-01T09:00:00.000Z
📍 Calling: http://localhost:3003/api/cron/subscription-management
✅ Subscription management completed successfully
📊 Results: { notifications: 0, renewals: 0, downgrades: 0, errors: [] }
```

## Cron Schedule Options

The example runs at 9 AM daily. You can modify the cron schedule:

```bash
# Run every hour
0 * * * *

# Run at 9 AM and 6 PM daily
0 9,18 * * *

# Run every 3 hours
0 */3 * * *

# Run every day at midnight
0 0 * * *

# Run every Monday at 9 AM
0 9 * * 1
```

## Monitoring

### Check Logs

View the cron execution logs:

```bash
tail -f /var/log/subscription-cron.log
```

Or check system logs:

```bash
grep CRON /var/log/syslog
```

### Verify the Endpoint

You can also test the endpoint is working:

```bash
curl -H "Authorization: Bearer your_cron_secret" \
  https://yourdomain.com/api/cron/subscription-management
```

## Troubleshooting

### Cron Job Not Running

1. Check cron service is running:

```bash
sudo service cron status
```

2. Check syntax:

```bash
crontab -l
```

3. Check for errors:

```bash
tail -f /var/log/syslog | grep CRON
```

### Permission Issues

Make sure the script has execute permissions:

```bash
chmod +x subscription-cron.js
```

### Path Issues

Use absolute paths in crontab:

```bash
# Good
/path/to/node/bin/node /path/to/project/subscription-cron.js

# Bad
node subscription-cron.js
```

### Environment Variables

Cron runs with a minimal environment. If you need environment variables:

1. Create a shell script wrapper:

```bash
#!/bin/bash
cd /path/to/swappe
source .env
node subscription-cron.js
```

2. Update crontab to call the wrapper:

```bash
0 9 * * * /path/to/wrapper.sh >> /var/log/subscription-cron.log 2>&1
```

## Production Security

For production, make sure:

1. `CRON_SECRET` is set to a strong random value
2. `DEV_BYPASS_CRON_AUTH` is NOT set or set to `false`
3. Your API endpoint is accessible only from the server
4. HTTPS is enabled
5. Firewall rules restrict access to your API

## Alternative: Systemd Timer (More Reliable)

Instead of cron, you can use systemd for more reliable scheduling:

1. Create service file: `/etc/systemd/system/subscription-cron.service`:

```ini
[Unit]
Description=Subscription Management Cron
After=network.target

[Service]
Type=oneshot
User=www-data
WorkingDirectory=/path/to/swappe
EnvironmentFile=/path/to/swappe/.env
ExecStart=/usr/bin/node /path/to/swappe/subscription-cron.js
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

2. Create timer file: `/etc/systemd/system/subscription-cron.timer`:

```ini
[Unit]
Description=Subscription Management Cron Timer
Requires=subscription-cron.service

[Timer]
OnCalendar=daily
OnCalendar=09:00
Persistent=true

[Install]
WantedBy=timers.target
```

3. Enable and start:

```bash
sudo systemctl enable subscription-cron.timer
sudo systemctl start subscription-cron.timer
sudo systemctl status subscription-cron.timer
```

## Summary

Once set up, the cron job will:

- Run daily at 9 AM
- Check all users with paid subscriptions
- Send notifications for expiring subscriptions
- Auto-renew subscriptions with sufficient balance
- Downgrade users without sufficient balance
- Log all results for monitoring
