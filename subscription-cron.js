#!/usr/bin/env node

/**
 * Subscription Management Cron Script
 *
 * This script runs daily at 9 AM via Ubuntu cron to manage user subscriptions
 *
 * To add to crontab, run:
 * crontab -e
 *
 * Then add this line:
 * 0 9 * * * cd /path/to/swappe && node subscription-cron.js
 */

const https = require("https");
const http = require("http");

const url = "https://swappe.ru";
const endpoint = `${url}/api/cron/subscription-management`;

// Check if URL is HTTPS or HTTP
const isHttps = url.startsWith("https://");
const urlObj = new URL(endpoint);

const options = {
  hostname: urlObj.hostname,
  port: urlObj.port || (isHttps ? 443 : 80),
  path: urlObj.pathname + urlObj.search,
  method: "GET",
  headers: {
    Authorization: `Bearer ${process.env.CRON_SECRET || "cron_secret_key"}`,
  },
};

console.log(
  `🔄 Executing subscription management cron at ${new Date().toISOString()}`,
);
console.log(`📍 Calling: ${endpoint}`);

const request = isHttps ? https.request : http.request;

const req = request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const result = JSON.parse(data);
      if (result.success) {
        console.log("✅ Subscription management completed successfully");
        console.log(`📊 Results:`, result.results);
      } else {
        console.error("❌ Subscription management failed:", result.error);
      }
    } catch (error) {
      console.error("Error parsing response:", error);
      console.log("Raw response:", data);
    }
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
});

req.on("error", (error) => {
  console.error("❌ Error calling cron endpoint:", error.message);
  process.exit(1);
});

req.end();
