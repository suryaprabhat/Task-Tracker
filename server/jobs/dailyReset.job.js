const cron = require("node-cron");
const Task = require("../models/task.model");

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🌙 Midnight reset started");

    const result = await Task.updateMany(
      {
        type: "daily",
        completedToday: true,
      },
      {
        $set: { completedToday: false },
      }
    );

    console.log(
      `✅ Daily tasks reset: ${result.modifiedCount}`
    );
  } catch (err) {
    console.error("❌ Midnight reset failed:", err);
  }
});
