const Candidate = require('../models/Candidate');

// Upload and verify new certificate
exports.uploadCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No certificate file uploaded' });
    }

    const { candidateId } = req.body;

    // In a real implementation, you would:
    // 1. Save the certificate to IPFS or blockchain
    // 2. Generate a verification hash
    // 3. Update the candidate record with verification details
    
    // For demo purposes, we'll just simulate the process
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Simulate blockchain verification
    const verificationHash = '0x' + require('crypto').randomBytes(32).toString('hex');
    const verificationDate = new Date();
    
    // Update candidate with verification details
    candidate.verification = {
      status: 'Verified',
      hash: verificationHash,
      date: verificationDate,
      verifiedBy: 'Blockchain'
    };
    
    await candidate.save();

    res.status(200).json({
      message: 'Certificate uploaded and verified successfully',
      verificationHash,
      candidate
    });
  } catch (error) {
    console.error('Certificate upload error:', error);
    res.status(500).json({ 
      message: 'Server error during certificate upload', 
      error: error.message 
    });
  }
};

// Verify existing certificate
exports.verifyCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No certificate file provided for verification' });
    }

    // In a real implementation, you would:
    // 1. Compare the uploaded certificate with the stored one
    // 2. Check the blockchain for the verification record
    
    // For demo purposes, we'll just simulate verification
    const isVerified = Math.random() > 0.2; // 80% chance of verification
    
    res.status(200).json({
      message: 'Certificate verification completed',
      isVerified,
      verificationDate: new Date()
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({ 
      message: 'Server error during certificate verification', 
      error: error.message 
    });
  }
};

// Get verification status for a candidate
exports.getVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidate = await Candidate.findById(id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.status(200).json({
      message: 'Verification status retrieved',
      verification: candidate.verification || { status: 'Not Verified' }
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving verification status', 
      error: error.message 
    });
  }
};

// Get blockchain verification details
exports.getVerificationDetails = async (req, res) => {
  try {
    // In a real implementation, you would fetch details from the blockchain
    
    // For demo purposes, we'll return mock data
    const mockDetails = {
      network: 'Ethereum',
      contractAddress: '0x742d35Cc6634C0532925a3b8D91D0a74b4A3Bb3D',
      blockNumber: 12345678,
      transactionHash: '0x' + require('crypto').randomBytes(32).toString('hex'),
      timestamp: new Date()
    };
    
    res.status(200).json({
      message: 'Verification details retrieved',
      details: mockDetails
    });
  } catch (error) {
    console.error('Get verification details error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving verification details', 
      error: error.message 
    });
  }
};