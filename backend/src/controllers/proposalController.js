const proposalService = require('../services/proposalService');
const ipfsService = require('../services/ipfsService');
const blockchainService = require('../services/blockchainService');

// Get all proposals with filters
const getProposals = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      proposer,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    const filters = {
      status,
      category,
      proposer,
      search
    };

    const sortOptions = {
      field: sortBy,
      order: sortOrder
    };

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await proposalService.getProposals(filters, sortOptions, pagination);
    
    res.json({
      success: true,
      data: result.proposals,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting proposals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch proposals',
      error: error.message
    });
  }
};

// Get proposal by ID
const getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await proposalService.getProposalById(id);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Error getting proposal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch proposal',
      error: error.message
    });
  }
};

// Create new proposal
const createProposal = async (req, res) => {
  try {
    const proposalData = req.body;
    const userAddress = req.user.address;

    // Upload proposal metadata to IPFS
    const ipfsHash = await ipfsService.uploadJSON({
      title: proposalData.title,
      description: proposalData.description,
      category: proposalData.category,
      budget: proposalData.budget,
      proposer: userAddress,
      createdAt: new Date().toISOString()
    });

    // Create proposal on blockchain
    const txHash = await blockchainService.createProposal({
      targets: proposalData.targets || [],
      values: proposalData.values || [0],
      calldatas: proposalData.calldatas || ['0x'],
      description: `ipfs://${ipfsHash}`,
      title: proposalData.title,
      budget: proposalData.budget,
      category: proposalData.category
    });

    // Store proposal in database
    const proposal = await proposalService.createProposal({
      ...proposalData,
      proposer: userAddress,
      ipfsHash,
      txHash,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: proposal,
      message: 'Proposal created successfully'
    });
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create proposal',
      error: error.message
    });
  }
};

// Update proposal
const updateProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userAddress = req.user.address;

    const proposal = await proposalService.updateProposal(id, updateData, userAddress);
    
    res.json({
      success: true,
      data: proposal,
      message: 'Proposal updated successfully'
    });
  } catch (error) {
    console.error('Error updating proposal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update proposal',
      error: error.message
    });
  }
};

// Delete proposal
const deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const userAddress = req.user.address;

    await proposalService.deleteProposal(id, userAddress);
    
    res.json({
      success: true,
      message: 'Proposal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete proposal',
      error: error.message
    });
  }
};

// Vote on proposal
const voteOnProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { support, reason } = req.body;
    const userAddress = req.user.address;

    // Submit vote to blockchain
    const txHash = await blockchainService.voteOnProposal(id, support, reason);

    // Store vote in database
    const vote = await proposalService.addVote(id, {
      voter: userAddress,
      support,
      reason,
      txHash
    });

    res.json({
      success: true,
      data: vote,
      message: 'Vote submitted successfully'
    });
  } catch (error) {
    console.error('Error voting on proposal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit vote',
      error: error.message
    });
  }
};

// Get proposal votes
const getProposalVotes = async (req, res) => {
  try {
    const { id } = req.params;
    const votes = await proposalService.getProposalVotes(id);
    
    res.json({
      success: true,
      data: votes
    });
  } catch (error) {
    console.error('Error getting proposal votes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch votes',
      error: error.message
    });
  }
};

// Get proposal comments
const getProposalComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await proposalService.getProposalComments(id);
    
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Error getting proposal comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

// Add comment to proposal
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userAddress = req.user.address;

    const comment = await proposalService.addComment(id, {
      author: userAddress,
      content,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      data: comment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

// Get proposal analytics
const getProposalAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const analytics = await proposalService.getProposalAnalytics(id);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting proposal analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Search proposals
const searchProposals = async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const result = await proposalService.searchProposals(query, pagination);
    
    res.json({
      success: true,
      data: result.proposals,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error searching proposals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search proposals',
      error: error.message
    });
  }
};

module.exports = {
  getProposals,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
  voteOnProposal,
  getProposalVotes,
  getProposalComments,
  addComment,
  getProposalAnalytics,
  searchProposals
};
