const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// ---------- CORS SETTINGS ----------
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "https://01fe23bcs377-ai-recruitment-frontend.vercel.app",
    "https://ai-recruitment-frontend.vercel.app",
    "https://ai-recruitment-frontend-rid4.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// ---------- MIDDLEWARE ----------
app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);

// Serve uploads folder (Render needs this explicitly)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- CONNECT DATABASE ----------
connectDB();

// ---------- ROUTES ----------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/rank", require("./routes/rankingRoutes"));
app.use("/api/verify", require("./routes/verificationRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "RecruitAI Backend is running...",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root Route
app.get("/", (req, res) => {
  res.send("RecruitAI Backend is running...");
});

// ---------- ERROR HANDLER ----------
app.use(errorHandler);

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
