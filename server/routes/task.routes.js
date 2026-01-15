const express = require("express");
const router = express.Router();
const Task = require("../models/task.model");
const auth = require("../middleware/auth.middleware");

console.log("✅ TASK ROUTES LOADED");

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// ✅ PATCH (THIS IS WHAT YOUR FRONTEND IS CALLING)
router.patch("/:id", auth, async (req, res) => {
  console.log("🔥 PATCH HIT", req.params.id);

  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (task.type !== "daily") {
    return res.status(400).json({ error: "Not a daily task" });
  }

  const today = new Date().toDateString();
  const last = task.lastCompletedAt
    ? new Date(task.lastCompletedAt).toDateString()
    : null;

  if (last === today) {
    return res.status(409).json({ error: "Already completed today" });
  }

  task.streak = last ? task.streak + 1 : 1;
  task.completedToday = true;
  task.lastCompletedAt = new Date();
  task.progress = 100;

  await task.save();
  res.json(task);
});

router.delete("/:id", auth, async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({ message: "Task deleted" });
});


module.exports = router;
