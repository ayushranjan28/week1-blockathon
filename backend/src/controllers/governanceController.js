const blockchainService = require('../services/blockchainService');
const proposalService = require('../services/proposalService');

// Get governance statistics
const getGovernanceStats = async (req, res) => {
  try {
    const [governanceParams, recentProposals, treasuryBalance] = await Promise.all([
      blockchainService.getGovernanceParameters(),
      proposalService.getProposals({}, {}, { page: 1, limit: 10 }),
      blockchainService.getTreasuryBalance(process.env.CIVIC_TOKEN_ADDRESS)
    ]);
    
    // Calculate additional stats
    const totalProposals = recentProposals.pagination.total;
    const activeProposals = recentProposals.proposals.filter(p => p.status === 'active').length;
    const executedProposals = recentProposals.proposals.filter(p => p.status === 'executed').length;
    
    res.json({
      success: true,
      data: {
        ...governanceParams,
        totalProposals,
        activeProposals,
        executedProposals,
        treasuryBalance,
        recentProposals: recentProposals.proposals
      }
    });
  } catch (error) {
    console.error('Error getting governance stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch governance statistics',
      error: error.message
    });
  }
};

// Get user's voting power
const getUserVotingPower = async (req, res) => {
  try {
    const { address } = req.params;
    const votingPower = await blockchainService.getVotingPower(address);
    
    res.json({
      success: true,
      data: votingPower
    });
  } catch (error) {
    console.error('Error getting user voting power:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch voting power',
      error: error.message
    });
  }
};

// Delegate voting power
const delegateVotingPower = async (req, res) => {
  try {
    const { delegatee } = req.body;
    const userAddress = req.user.address;
    
    const txHash = await blockchainService.delegateVotingPower(delegatee);
    
    res.json({
      success: true,
      data: { txHash },
      message: 'Voting power delegated successfully'
    });
  } catch (error) {
    console.error('Error delegating voting power:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delegate voting power',
      error: error.message
    });
  }
};

// Get transaction status
const getTransactionStatus = async (req, res) => {
  try {
    const { txHash } = req.params;
    const status = await blockchainService.getTransactionStatus(txHash);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error getting transaction status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction status',
      error: error.message
    });
  }
};

// Execute proposal
const executeProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const userAddress = req.user.address;
    
    const txHash = await blockchainService.executeProposal(id);
    
    res.json({
      success: true,
      data: { txHash },
      message: 'Proposal execution initiated'
    });
  } catch (error) {
    console.error('Error executing proposal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute proposal',
      error: error.message
    });
  }
};

// Get governance history
const getGovernanceHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const recentProposals = await blockchainService.getRecentProposals(parseInt(limit));
    
    res.json({
      success: true,
      data: recentProposals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: recentProposals.length
      }
    });
  } catch (error) {
    console.error('Error getting governance history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch governance history',
      error: error.message
    });
  }
};

module.exports = {
  getGovernanceStats,
  getUserVotingPower,
  delegateVotingPower,
  getTransactionStatus,
  executeProposal,
  getGovernanceHistory
};