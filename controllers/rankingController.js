const Candidate = require("../models/Candidate");

// Rank candidates based on job requirements
exports.rankCandidates = async (req, res) => {
    try {
        const { jobId, requiredSkills, experienceLevel } = req.body;
        
        // Get all candidates
        const candidates = await Candidate.find();
        
        // Rank candidates based on skills match and experience
        const rankedCandidates = candidates.map(candidate => {
            // Calculate skill match score (0-100)
            let skillMatchScore = 0;
            if (requiredSkills && requiredSkills.length > 0) {
                const matchingSkills = candidate.skills.filter(skill => 
                    requiredSkills.includes(skill)
                );
                skillMatchScore = Math.round((matchingSkills.length / requiredSkills.length) * 100);
            }
            
            // Calculate experience score (0-100)
            let experienceScore = 0;
            if (experienceLevel && candidate.experience) {
                const candidateExp = parseInt(candidate.experience) || 0;
                const requiredExp = parseInt(experienceLevel) || 0;
                
                if (candidateExp >= requiredExp) {
                    experienceScore = 100;
                } else if (requiredExp > 0) {
                    experienceScore = Math.round((candidateExp / requiredExp) * 100);
                }
            }
            
            // Calculate overall match score (weighted average)
            const matchScore = Math.round((skillMatchScore * 0.7) + (experienceScore * 0.3));
            
            return {
                ...candidate.toObject(),
                skillMatchScore,
                experienceScore,
                matchScore
            };
        });
        
        // Sort by match score (descending)
        rankedCandidates.sort((a, b) => b.matchScore - a.matchScore);
        
        // Update match scores in database
        for (const candidate of rankedCandidates) {
            await Candidate.findByIdAndUpdate(candidate._id, {
                matchScore: candidate.matchScore
            });
        }
        
        res.status(200).json({
            message: "Candidates ranked successfully",
            jobId,
            candidates: rankedCandidates
        });
    } catch (error) {
        console.error("Ranking error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get top candidates
exports.getTopCandidates = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const topCandidates = await Candidate.find()
            .sort({ matchScore: -1 })
            .limit(limit);
            
        res.status(200).json({
            message: "Top candidates retrieved successfully",
            candidates: topCandidates
        });
    } catch (error) {
        console.error("Get top candidates error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get candidate ranking details
exports.getCandidateRanking = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        
        res.status(200).json({
            message: "Candidate ranking details retrieved successfully",
            candidate
        });
    } catch (error) {
        console.error("Get candidate ranking error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
