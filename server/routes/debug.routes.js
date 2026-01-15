const express = require("express");
const Task = require("../models/task.model");

const router = express.Router();

router.post("/force", async (req, res) => {
  const task = await Task.create({
    title: "FORCE TEST",
    type: "temporary",
    deadline: new Date(Date.now() + 10 * 60 * 1000), // 10 min from now (UTC)
    completed: false,
    notified: false,
  });

  console.log("✅ FORCE INSERTED:", task.title, task.deadline.toISOString());
  res.json(task);
});

module.exports = router;
