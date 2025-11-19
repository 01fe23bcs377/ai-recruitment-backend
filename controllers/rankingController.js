const Candidate = require('../models/Candidate');

// Rank candidates based on skills matching
exports.rankCandidates = async (req, res) => {
  try {
    const { requiredSkills } = req.body;
    
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ 
        message: 'Required skills must be provided as an array' 
      });
    }
    
    // Get all candidates
    const candidates = await Candidate.find({ status: 'Parsed' });
    
    // Rank candidates based on skill matching
    const rankedCandidates = candidates.map(candidate => {
      // Count matching skills
      const matchingSkills = candidate.skills.filter(skill => 
        requiredSkills.some(requiredSkill => 
          skill.toLowerCase().includes(requiredSkill.toLowerCase())
        )
      );
      
      const matchPercentage = requiredSkills.length > 0 ? 
        (matchingSkills.length / requiredSkills.length) * 100 : 0;
      
      return {
        ...candidate.toObject(),
        matchPercentage: Math.round(matchPercentage * 100) / 100,
        matchingSkills
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    res.json({
      message: 'Candidates ranked successfully',
      candidates: rankedCandidates
    });
  } catch (error) {
    console.error('Ranking error:', error);
    res.status(500).json({ 
      message: 'Server error during ranking', 
      error: error.message 
    });
  }
};

// Get top candidates
exports.getTopCandidates = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get candidates sorted by match percentage (assuming they've been ranked)
    const candidates = await Candidate.find({ status: 'Parsed' })
      .sort({ matchPercentage: -1 })
      .limit(limit);
    
    res.json({
      message: 'Top candidates retrieved',
      candidates
    });
  } catch (error) {
    console.error('Get top candidates error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving candidates', 
      error: error.message 
    });
  }
};

// Get specific candidate ranking
exports.getCandidateRanking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidate = await Candidate.findById(id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.json({
      message: 'Candidate ranking details',
      candidate
    });
  } catch (error) {
    console.error('Get candidate ranking error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving candidate', 
      error: error.message 
    });
  }
};