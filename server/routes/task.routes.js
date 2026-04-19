const express = require("express");
const router = express.Router();
const Task = require("../models/task.model");
const auth = require("../middleware/auth.middleware");

console.log("✅ TASK ROUTES LOADED");

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Given a "HH:MM" string, returns a Date for that time today (UTC).
 */
function buildDailyReminderAt(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  // If the time has already passed today, schedule for tomorrow
  if (d <= new Date()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

// ── CREATE ───────────────────────────────────────────────────────────────────
router.post("/", auth, async (req, res) => {
  try {
    const { type, deadline, dailyReminderTime, reminderAt, ...rest } = req.body;

    // Server-side type-specific validation
    if (type === "temporary" && !deadline) {
      return res.status(400).json({ error: "Temporary tasks require a deadline." });
    }

    // Build the correct reminderAt per task type
    let computedReminderAt = null;

    if (type === "daily") {
      // Daily tasks use a time-of-day stored in dailyReminderTime ("HH:MM")
      if (dailyReminderTime) {
        computedReminderAt = buildDailyReminderAt(dailyReminderTime);
      }
    } else {
      // Temporary / ongoing use an absolute datetime
      computedReminderAt = reminderAt || null;
    }

    const task = await Task.create({
      ...rest,
      type,
      deadline: deadline || null,
      dailyReminderTime: type === "daily" ? (dailyReminderTime || null) : null,
      reminderAt: computedReminderAt,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET ──────────────────────────────────────────────────────────────────────
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PATCH (complete daily) ───────────────────────────────────────────────────
router.patch("/:id", auth, async (req, res) => {
  console.log("🔥 PATCH HIT", req.params.id);

  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

  if (!task) return res.status(404).json({ error: "Task not found" });
  if (task.type !== "daily") return res.status(400).json({ error: "Not a daily task" });

  const today = new Date().toDateString();
  const last = task.lastCompletedAt
    ? new Date(task.lastCompletedAt).toDateString()
    : null;

  if (last === today) return res.status(409).json({ error: "Already completed today" });

  task.streak = last ? task.streak + 1 : 1;
  task.completedToday = true;
  task.lastCompletedAt = new Date();
  task.progress = 100;

  // Re-arm the reminder for tomorrow if dailyReminderTime is set
  if (task.dailyReminderTime) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [h, m] = task.dailyReminderTime.split(":").map(Number);
    tomorrow.setHours(h, m, 0, 0);
    task.reminderAt = tomorrow;
    task.notified = false;
  }

  await task.save();
  res.json(task);
});

// ── DELETE ───────────────────────────────────────────────────────────────────
router.delete("/:id", auth, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!task) return res.status(404).json({ error: "Task not found" });

  res.json({ message: "Task deleted" });
});

module.exports = router;
