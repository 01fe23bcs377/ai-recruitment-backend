const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'https://01fe23bcs377-ai-recruitment-frontend.vercel.app',
    'https://ai-recruitment-frontend.vercel.app',
    'https://ai-recruitment-frontend-rid4.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(logger); // Request logging

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/rank", require("./routes/rankingRoutes"));
app.use("/api/verify", require("./routes/verificationRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "RecruitAI Backend is running...",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test Route
app.get("/", (req, res) => {
  res.send("RecruitAI Backend is running...");
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
