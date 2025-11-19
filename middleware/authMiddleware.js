const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // For demo purposes, we'll allow all requests to pass through
  // In a production environment, you would implement proper JWT authentication here
  
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Allow requests without token for demo purposes
  if (!token) {
    console.log('No token provided, allowing access for demo');
    return next();
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed, allowing access for demo');
    next();
  }
};

module.exports = { protect };