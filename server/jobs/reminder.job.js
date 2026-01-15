const cron = require("node-cron");
const Task = require("../models/task.model");
const User = require("../models/user.model");
const notify = require("../services/notify.service");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      reminderAt: { $lte: now },
      notified: false,
      completed: false,
    }).populate("user");

    for (const task of tasks) {
      if (!task.user?.email) continue;

      await notify.sendEmail(task.user.email, task);

      task.notified = true;
      await task.save();

      console.log("✅ Reminder sent:", task.title);
    }
  } catch (err) {
    console.error("🔥 Reminder job error:", err);
  }
});

console.log("📆 Reminder cron scheduled");
