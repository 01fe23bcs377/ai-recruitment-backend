const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

// Load env variables
dotenv.config();

const app = express();

// ----------- CORS FIX (REQUIRED for Render + Vercel) -------------
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost:5173",
      "https://ai-recruitment-frontend.vercel.app",
      "https://ai-recruitment-frontend-rid4.vercel.app",
      "https://01fe23bcs377-ai-recruitment-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Body parser
app.use(express.json());
app.use(logger);

// Connect MongoDB
connectDB();

// ------------------- API ROUTES -------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/rank", require("./routes/rankingRoutes"));
app.use("/api/verify", require("./routes/verificationRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// ------------------- HEALTH CHECK -------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend running successfully",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ------------------- ROOT ROUTE -------------------
app.get("/", (req, res) => {
  res.send("RecruitAI Backend is running...");
});

// Error handler
app.use(errorHandler);

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
