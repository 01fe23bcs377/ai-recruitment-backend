const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// Enhanced CORS configuration for deployed environment
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "https://ai-recruitment-frontend.vercel.app",
    "https://ai-recruitment-frontend-cyan.vercel.app",
    "https://ai-recruitment-frontend-rid4.vercel.app",
    "https://01fe23bcs377-ai-recruitment-frontend.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(logger); // Request logging

// Connect to MongoDB
connectDB();

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/rank", require("./routes/rankingRoutes"));
app.use("/api/verify", require("./routes/verificationRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend running successfully",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
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
