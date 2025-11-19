const Candidate = require('../models/Candidate');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total candidates count
    const totalCandidates = await Candidate.countDocuments();
    
    // Get candidates by status
    const statusCounts = await Candidate.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent candidates (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentCandidates = await Candidate.countDocuments({
      uploadedAt: { $gte: oneWeekAgo }
    });
    
    // Get verified candidates count
    const verifiedCandidates = await Candidate.countDocuments({
      'verification.status': 'Verified'
    });
    
    // Format the response
    const stats = {
      totalCandidates,
      recentCandidates,
      verifiedCandidates,
      statusDistribution: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
    
    res.status(200).json({
      message: 'Dashboard statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving dashboard statistics', 
      error: error.message 
    });
  }
};