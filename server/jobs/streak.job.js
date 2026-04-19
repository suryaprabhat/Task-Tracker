const cron = require("node-cron");
const Task = require("../models/task.model");
const Streak = require("../models/streak.model");

cron.schedule("59 23 * * *", async () => {
  const today = new Date().toISOString().slice(0, 10);

  const dailyTasks = await Task.find({ type: "daily" });

  const success =
    dailyTasks.length > 0 &&
    dailyTasks.every((task) => task.completed);

  await Streak.findOneAndUpdate(
    { date: today },
    { success },
    { upsert: true }
  );

  console.log("Daily streak evaluated:", today, success);
});
