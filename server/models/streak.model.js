const mongoose = require("mongoose");

const StreakSchema = new mongoose.Schema({
  date: { type: String, unique: true }, // YYYY-MM-DD
  success: Boolean,
});

module.exports = mongoose.model("Streak", StreakSchema);
