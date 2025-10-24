const express = require('express');
const router = express.Router();
const governanceController = require('../controllers/governanceController');
const { authenticateUser } = require('../middleware/auth');

// Get governance statistics
router.get('/stats', governanceController.getGovernanceStats);

// Get user's voting power
router.get('/voting-power/:address', governanceController.getUserVotingPower);

// Delegate voting power
router.post('/delegate', authenticateUser, governanceController.delegateVotingPower);

// Get transaction status
router.get('/transaction/:txHash', governanceController.getTransactionStatus);

// Execute proposal
router.post('/execute/:id', authenticateUser, governanceController.executeProposal);

// Get governance history
router.get('/history', governanceController.getGovernanceHistory);

module.exports = router;