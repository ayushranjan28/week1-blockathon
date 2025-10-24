const blockchainService = require('../services/blockchainService');
const proposalService = require('../services/proposalService');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// In-memory user storage for demo purposes
// In production, this would be a database
let users = [];

// Mock users for demo
const mockUsers = [
  {
    id: '1',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    isAdmin: false,
    isVerified: true,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: '2',
    address: '0x9876543210fedcba9876543210fedcba98765432',
    name: 'Bob Smith',
    email: 'bob@example.com',
    isAdmin: true,
    isVerified: true,
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

// Initialize with mock data
users = [...mockUsers];

// Register or login user
const registerOrLogin = async (req, res) => {
  try {
    const { address, signature, message } = req.body;
    
    // In a real implementation, you would verify the signature here
    // For demo purposes, we'll skip signature verification
    
    let user = users.find(u => u.address.toLowerCase() === address.toLowerCase());
    
    if (!user) {
      // Create new user
      user = {
        id: uuidv4(),
        address: address.toLowerCase(),
        name: '',
        email: '',
        isAdmin: false,
        isVerified: false,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      users.push(user);
    } else {
      // Update last login
      user.lastLogin = new Date();
    }
    
    // Check if user is verified on blockchain
    try {
      const isVerified = await blockchainService.isUserVerified(address);
      user.isVerified = isVerified;
    } catch (error) {
      console.log('Could not check verification status:', error.message);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        address: user.address,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          address: user.address,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        token
      },
      message: user.isVerified ? 'Login successful' : 'Registration successful'
    });
  } catch (error) {
    console.error('Error in register/login:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { address } = req.params;
    const user = users.find(u => u.address.toLowerCase() === address.toLowerCase());
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get additional blockchain data
    const [votingPower, identity] = await Promise.all([
      blockchainService.getVotingPower(address).catch(() => null),
      blockchainService.getUserIdentity(address).catch(() => null)
    ]);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          address: user.address,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        votingPower,
        identity
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { address } = req.params;
    const updateData = req.body;
    const userAddress = req.user.address;
    
    // Check if user is updating their own profile or is admin
    if (address.toLowerCase() !== userAddress.toLowerCase() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Can only update your own profile'
      });
    }
    
    const userIndex = users.findIndex(u => u.address.toLowerCase() === address.toLowerCase());
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      address: users[userIndex].address // Don't allow address changes
    };
    
    res.json({
      success: true,
      data: users[userIndex],
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Submit ZK proof for identity verification
const submitZKProof = async (req, res) => {
  try {
    const { identityHash, proof, metadata } = req.body;
    const userAddress = req.user.address;
    
    // Submit proof to blockchain
    const txHash = await blockchainService.submitZKProof(identityHash, proof, metadata);
    
    // Update user verification status
    const user = users.find(u => u.address.toLowerCase() === userAddress.toLowerCase());
    if (user) {
      user.isVerified = true;
    }
    
    res.json({
      success: true,
      data: { txHash },
      message: 'ZK proof submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting ZK proof:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit ZK proof',
      error: error.message
    });
  }
};

// Get user's voting history
const getUserVotingHistory = async (req, res) => {
  try {
    const { address } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // In a real implementation, you would query the database for user's votes
    // For demo purposes, return empty array
    const votes = [];
    
    res.json({
      success: true,
      data: votes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: votes.length
      }
    });
  } catch (error) {
    console.error('Error getting voting history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch voting history',
      error: error.message
    });
  }
};

// Get user's proposals
const getUserProposals = async (req, res) => {
  try {
    const { address } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Get proposals created by this user
    const result = await proposalService.getProposals(
      { proposer: address },
      { field: 'createdAt', order: 'desc' },
      { page: parseInt(page), limit: parseInt(limit) }
    );
    
    res.json({
      success: true,
      data: result.proposals,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting user proposals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user proposals',
      error: error.message
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, verified } = req.query;
    
    let filteredUsers = [...users];
    
    // Apply filters
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm) ||
        u.address.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
      );
    }
    
    if (verified !== undefined) {
      const isVerified = verified === 'true';
      filteredUsers = filteredUsers.filter(u => u.isVerified === isVerified);
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredUsers.length,
        pages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Update user verification status (admin only)
const updateUserVerification = async (req, res) => {
  try {
    const { address } = req.params;
    const { isVerified } = req.body;
    
    const user = users.find(u => u.address.toLowerCase() === address.toLowerCase());
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.isVerified = isVerified;
    
    res.json({
      success: true,
      data: user,
      message: 'User verification status updated'
    });
  } catch (error) {
    console.error('Error updating user verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update verification status',
      error: error.message
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const { address } = req.params;
    
    const [votingPower, userProposals, userVotes] = await Promise.all([
      blockchainService.getVotingPower(address).catch(() => null),
      proposalService.getProposals({ proposer: address }, {}, { page: 1, limit: 1000 }),
      // In a real implementation, you would get user's votes from database
      Promise.resolve({ votes: [] })
    ]);
    
    const stats = {
      votingPower: votingPower?.votingPower || '0',
      tokenBalance: votingPower?.balance || '0',
      proposalsCreated: userProposals.pagination.total,
      votesCast: userVotes.votes.length,
      isVerified: users.find(u => u.address.toLowerCase() === address.toLowerCase())?.isVerified || false
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};

module.exports = {
  registerOrLogin,
  getUserProfile,
  updateUserProfile,
  submitZKProof,
  getUserVotingHistory,
  getUserProposals,
  getAllUsers,
  updateUserVerification,
  getUserStats
};