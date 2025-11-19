// Validation middleware for candidate upload
const validateCandidateUpload = (req, res, next) => {
  const { name, email } = req.body;
  
  // Check if required fields are present
  if (!name || !email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name and email are required' 
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }
  
  next();
};

// Validation middleware for ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  // Simple ObjectId validation (24 character hex string)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(id)) {
    return res.status(400).json({ 
      message: 'Invalid ID format' 
    });
  }
  
  next();
};

module.exports = { validateCandidateUpload, validateObjectId };