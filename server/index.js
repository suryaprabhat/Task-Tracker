console.log("🚀 REAL INDEX.JS LOADED");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");


const app = express();

// ✅ CORS FIRST
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-tracker-ec3o.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"), false);
      }
    },
    credentials: true,
  })
);


// ✅ THEN body parser
app.use(express.json());

/* database */
connectDB();

/* routes */
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/subscriptions", require("./routes/subscription.routes"));
app.use("/api/streaks", require("./routes/streak.route"));
app.use("/api/debug", require("./routes/debug.routes"));
app.use("/api/auth", require("./routes/auth.routes"));



/* background jobs (self-registering) */
require("./jobs/reminder.job");
require("./jobs/streak.job");
require("./jobs/dailyReset.job");


/* global error handler */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const debugRoutes = require("./routes/debug.routes");
console.log("🧩 Debug routes type:", typeof debugRoutes);
app.use("/api/debug", debugRoutes);

