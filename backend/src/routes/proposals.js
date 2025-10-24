const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const { validateProposal, validateVote, validateComment } = require('../middleware/auth');
const { authenticateUser } = require('../middleware/auth');

// Get all proposals with filters
router.get('/', proposalController.getProposals);

// Get proposal by ID
router.get('/:id', proposalController.getProposalById);

// Create new proposal
router.post('/', authenticateUser, validateProposal, proposalController.createProposal);

// Update proposal (only by proposer)
router.put('/:id', authenticateUser, proposalController.updateProposal);

// Delete proposal (only by proposer)
router.delete('/:id', authenticateUser, proposalController.deleteProposal);

// Vote on proposal
router.post('/:id/vote', authenticateUser, validateVote, proposalController.voteOnProposal);

// Get proposal votes
router.get('/:id/votes', proposalController.getProposalVotes);

// Get proposal comments
router.get('/:id/comments', proposalController.getProposalComments);

// Add comment to proposal
router.post('/:id/comments', authenticateUser, proposalController.addComment);

// Get proposal analytics
router.get('/:id/analytics', proposalController.getProposalAnalytics);

// Search proposals
router.get('/search/:query', proposalController.searchProposals);

module.exports = router;
