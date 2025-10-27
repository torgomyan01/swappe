# Cron Job Testing Commands for Ubuntu Server

## 1. Manual Testing (Direct)

SSH into your server and run:

```bash
# Navigate to project
cd /path/to/swappe

# Test the script
node subscription-cron.js
```

## 2. Test API Endpoint

```bash
# From your Ubuntu server
curl -H "Authorization: Bearer your_cron_secret" \
  https://swappe.ru/api/cron/subscription-management
```

## 3. Check Cron Service Status

```bash
# Check if cron is running
sudo service cron status

# Restart cron if needed
sudo service cron restart
```

## 4. View Cron Logs

```bash
# System logs
sudo tail -f /var/log/syslog | grep CRON

# Your custom log (if configured)
tail -f /var/log/subscription-cron.log
```

## 5. Check Crontab

```bash
# View your cron jobs
crontab -l

# Edit crontab
crontab -e
```

## 6. Force Test with Future Time

```bash
# Temporarily add a cron job to run NOW (for testing)
# Add this to crontab, then remove it after testing:
* * * * * cd /path/to/swappe && node subscription-cron.js

# This runs every minute - REMOVE after testing!
```

## 7. Test with Detailed Logging

Create a test script `test-subscription.sh`:

```bash
#!/bin/bash
set -x
cd /path/to/swappe
export CRON_SECRET="your_secret"
export SITE_URL="https://swappe.ru"
node subscription-cron.js 2>&1 | tee /tmp/subscription-test.log
```

Make it executable and run:

```bash
chmod +x test-subscription.sh
./test-subscription.sh
```

## 8. Check Database After Execution

After cron runs, check the database to see if subscriptions were updated:

```bash
# Connect to your database and check
mysql -u user -p database_name

# Query to see users and their subscription status
SELECT id, email, tariff, tariff_end_date, balance
FROM users
WHERE tariff != 'free'
ORDER BY tariff_end_date;
```

## Quick Checklist

- [ ] Script is executable: `chmod +x subscription-cron.js`
- [ ] Environment variables are set in `.env`
- [ ] Cron job is added: `crontab -l`
- [ ] Cron service is running: `sudo service cron status`
- [ ] Manual test works: `node subscription-cron.js`
- [ ] API endpoint is accessible: `curl https://swappe.ru/api/cron/subscription-management`
- [ ] Logs are being generated
