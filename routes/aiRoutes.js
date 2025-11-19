const express = require("express");
const { parseResume, batchParseResumes } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// AI Resume Parsing Routes
router.get("/parse/:id", protect, parseResume);
router.post("/batch-parse", protect, batchParseResumes);

module.exports = router;
