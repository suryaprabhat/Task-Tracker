const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["daily", "temporary", "ongoing"],
      required: true,
    },

    /* DEADLINE + REMINDER */
    deadline: {
      type: Date,
      required: true,
    },

    reminderAt: {
      type: Date, // exact time when reminder should be sent
      default: null,
    },

    notified: {
      type: Boolean,
      default: false,
    },

    /* DAILY TASK STATE */
    completedToday: {
      type: Boolean,
      default: false,
    },

    lastCompletedAt: {
      type: Date,
      default: null,
    },

    streak: {
      type: Number,
      default: 0,
    },

    /* PROGRESS */
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    /* OWNERSHIP */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* SAFETY: ensure progress stays valid */
taskSchema.pre("save", function () {
  if (this.progress < 0) this.progress = 0;
  if (this.progress > 100) this.progress = 100;
});

module.exports = mongoose.model("Task", taskSchema);
