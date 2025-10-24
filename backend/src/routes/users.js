const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser, authenticateAdmin, validateUser, validateZKProof } = require('../middleware/auth');

// Register or login user
router.post('/auth', userController.registerOrLogin);

// Get user profile
router.get('/:address', userController.getUserProfile);

// Update user profile
router.put('/:address', authenticateUser, validateUser, userController.updateUserProfile);

// Submit ZK proof for identity verification
router.post('/:address/verify', authenticateUser, validateZKProof, userController.submitZKProof);

// Get user's voting history
router.get('/:address/votes', userController.getUserVotingHistory);

// Get user's proposals
router.get('/:address/proposals', userController.getUserProposals);

// Get user statistics
router.get('/:address/stats', userController.getUserStats);

// Admin routes
// Get all users (admin only)
router.get('/', authenticateAdmin, userController.getAllUsers);

// Update user verification status (admin only)
router.put('/:address/verification', authenticateAdmin, userController.updateUserVerification);

module.exports = router;