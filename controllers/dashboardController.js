const Candidate = require("../models/Candidate");

// GET DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total candidates count
        const totalCandidates = await Candidate.countDocuments();
        
        // Get verified candidates (assuming status field indicates verification)
        const verifiedCandidates = await Candidate.countDocuments({ verified: true });
        
        // Calculate verification rate
        const verificationRate = totalCandidates > 0 
            ? Math.round((verifiedCandidates / totalCandidates) * 100) 
            : 0;
            
        // Get recent candidates (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentCandidates = await Candidate.countDocuments({
            uploadedAt: { $gte: thirtyDaysAgo }
        });
        
        // Calculate average match score (mock data for now)
        const avgMatchScore = 87; // This would come from actual matching logic
        
        // Get top candidates (sorted by match score)
        const topCandidates = await Candidate.find()
            .sort({ matchScore: -1 }) // Assuming matchScore field exists
            .limit(5)
            .select('name email skills matchScore education');
            
        // Recent activity (mock data)
        const recentActivity = [
            {
                type: 'upload',
                title: 'New Resume Uploaded',
                description: 'John Doe - Senior Developer',
                time: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
            },
            {
                type: 'verification',
                title: 'Certificate Verified',
                description: 'Jane Smith - MS Computer Science',
                time: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
            },
            {
                type: 'match',
                title: 'New Match Found',
                description: '3 candidates matched for Frontend Developer',
                time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            }
        ];

        res.status(200).json({
            stats: {
                totalCandidates,
                verifiedCandidates,
                verificationRate,
                recentCandidates,
                avgMatchScore
            },
            topCandidates,
            recentActivity
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
