/**
 * Ranking Routes
 * Handles candidate ranking and matching endpoints
 */

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { validateObjectId } = require("../middleware/validationMiddleware");
const {
  rankCandidates,
  getTopCandidates,
  getCandidateRanking
} = require("../controllers/rankingController");

// Rank candidates based on job requirements
router.post("/", protect, rankCandidates);

// Get top candidates
router.get("/top", protect, getTopCandidates);

// Get candidate ranking details
router.get("/:id", protect, validateObjectId, getCandidateRanking);

module.exports = router;
