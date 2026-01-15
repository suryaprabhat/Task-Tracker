const express = require("express");
const router = express.Router();
const Streak = require("../models/streak.model");

router.get("/", async (req, res) => {
  const streaks = await Streak.find().sort({ date: 1 });
  res.json(streaks);
});

module.exports = router;
