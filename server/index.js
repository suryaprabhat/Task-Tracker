console.log("🚀 REAL INDEX.JS LOADED");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");


const app = express();

// ✅ CORS FIRST
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://q1wwsr42-5173.inc1.devtunnels.ms",
      "https://task-tracker-ec3o.vercel.app/"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

