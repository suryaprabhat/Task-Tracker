const Task = require("../models/task.model");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, type, deadline, progress } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const task = await Task.create({
      title,
      type,
      deadline: deadline ? new Date(deadline) : undefined,
      progress: progress ?? 0,
      user: req.userId, // ✅ FIXED
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(400).json({ error: err.message });
  }
};

// GET TASKS (LOGGED-IN USER ONLY)
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.deadline) {
      updates.deadline = new Date(updates.deadline);
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
