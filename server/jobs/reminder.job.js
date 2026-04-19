const cron = require("node-cron");
const Task = require("../models/task.model");
const User = require("../models/user.model");
const notify = require("../services/notify.service");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const currentHours = now.getHours().toString().padStart(2, "0");
    const currentMinutes = now.getMinutes().toString().padStart(2, "0");
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    const prev = new Date(now.getTime() - 60000);
    const time2 = `${prev.getHours().toString().padStart(2, "0")}:${prev.getMinutes().toString().padStart(2, "0")}`;

    const prev2 = new Date(now.getTime() - 120000);
    const time3 = `${prev2.getHours().toString().padStart(2, "0")}:${prev2.getMinutes().toString().padStart(2, "0")}`;
    
    const prev3 = new Date(now.getTime() - 180000);
    const time4 = `${prev3.getHours().toString().padStart(2, "0")}:${prev3.getMinutes().toString().padStart(2, "0")}`;

    const prev4 = new Date(now.getTime() - 240000);
    const time5 = `${prev4.getHours().toString().padStart(2, "0")}:${prev4.getMinutes().toString().padStart(2, "0")}`;

    const tasks = await Task.find({
      $or: [
        {
          reminderAt: { $lte: now },
          notified: false,
          progress: { $lt: 100 },
          type: { $ne: "daily" },
        },
        {
          type: "daily",
          dailyReminderTime: { $in: [currentTimeStr, time2, time3, time4, time5] },
          notified: false,
          completedToday: false,
        },
      ],
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
