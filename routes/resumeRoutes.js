const express = require("express");
const router = express.Router();
const { resumeUpload, handleMulterError } = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume, getCandidates, getSingleCandidate, deleteCandidate } = require("../controllers/resumeController");

router.post("/upload", protect, resumeUpload.single("resume"), handleMulterError, uploadResume);
router.get("/all", protect, getCandidates);
router.get("/:id", protect, getSingleCandidate);
router.delete("/:id", protect, deleteCandidate);

module.exports = router;
