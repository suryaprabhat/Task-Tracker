console.log("🚀 REAL INDEX.JS LOADED");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

/* ===== CORS (FIRST) ===== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-tracker-ec3o.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ✅ REQUIRED for preflight
app.use(cors());

/* ===== BODY PARSER ===== */
app.use(express.json());

/* ===== DATABASE ===== */
connectDB();

/* ===== ROUTES ===== */
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/subscriptions", require("./routes/subscription.routes"));
app.use("/api/streaks", require("./routes/streak.route"));
app.use("/api/debug", require("./routes/debug.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

/* ===== BACKGROUND JOBS ===== */
require("./jobs/reminder.job");
require("./jobs/streak.job");
require("./jobs/dailyReset.job");

/* ===== ERROR HANDLER ===== */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.message);

  if (err.message === "CORS not allowed") {
    return res.status(403).json({ message: "CORS blocked" });
  }

  res.status(500).json({ message: "Internal Server Error" });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
