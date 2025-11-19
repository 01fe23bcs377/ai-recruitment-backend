const express = require("express");
const router = express.Router();
const { certificateUpload, handleMulterError } = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { 
  uploadCertificate,
  verifyCertificate,
  getVerificationStatus,
  getVerificationDetails
} = require("../controllers/verificationController");

// Upload and verify new certificate
router.post("/upload", protect, certificateUpload.single("certificate"), handleMulterError, uploadCertificate);

// Verify existing certificate
router.post("/verify", protect, certificateUpload.single("certificate"), handleMulterError, verifyCertificate);

// Get verification status for a candidate
router.get("/status/:id", protect, getVerificationStatus);

// Get blockchain verification details
router.get("/details", protect, getVerificationDetails);

module.exports = router;