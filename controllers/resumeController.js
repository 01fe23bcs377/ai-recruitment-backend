const Candidate = require("../models/Candidate");
const path = require("path");
const fs = require("fs");
const { validateCandidateUpload } = require("../middleware/validationMiddleware");

// UPLOAD RESUME + SAVE CANDIDATE
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { name, email } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ message: "Name and Email are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if candidate already exists
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            return res.status(400).json({ message: "Candidate with this email already exists" });
        }

        // Save candidate into DB
        const newCandidate = new Candidate({
            name,
            email,
            resume: req.file.filename,
            uploadedAt: new Date()
        });

        await newCandidate.save();

        res.status(201).json({
            message: "Resume uploaded & candidate saved successfully",
            candidate: newCandidate
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET ALL CANDIDATES
exports.getCandidates = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const candidates = await Candidate.find()
            .sort({ uploadedAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Candidate.countDocuments();
        
        res.status(200).json({
            candidates,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get candidates error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET SINGLE CANDIDATE
exports.getSingleCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        res.status(200).json(candidate);
    } catch (error) {
        console.error("Get candidate error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE CANDIDATE
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        // Delete resume file if it exists
        const filePath = path.join(__dirname, "../uploads/", candidate.resume);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete candidate from DB
        await Candidate.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (error) {
        console.error("Delete candidate error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
