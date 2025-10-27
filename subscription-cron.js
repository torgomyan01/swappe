const { default: axios } = require("axios");

const url = `https://swappe.ru/api/cron/subscription-management`;
axios.get(url).then((res) => {
  if (res.data.success) {
    console.log("✅ Subscription management completed successfully");
    console.log(`📊 Results:`, res.data.results);
  } else {
    console.error("❌ Subscription management failed:", res.data.error);
  }
});
