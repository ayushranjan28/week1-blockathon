const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo purposes
// In production, this would be a database
let proposals = [];
let votes = [];
let comments = [];

// Mock data for demo
const mockProposals = [
  {
    id: '1',
    title: 'New Bike Lane Infrastructure',
    description: 'This proposal aims to implement a comprehensive bike lane infrastructure project on Main Street to improve cycling safety and promote sustainable transportation within our city.',
    proposer: '0x1234567890abcdef1234567890abcdef12345678',
    budget: '50000',
    category: 'Infrastructure',
    status: 'active',
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    startBlock: 1000000,
    endBlock: 1001000,
    votesFor: 1250,
    votesAgainst: 320,
    votesAbstain: 50,
    totalVotes: 1620,
    quorum: 1000,
    executed: false,
    canceled: false,
    ipfsHash: 'QmMockHash1',
    txHash: '0xMockTxHash1'
  },
  {
    id: '2',
    title: 'Community Garden Initiative',
    description: 'Establish community gardens in three neighborhoods to promote local food production and community engagement.',
    proposer: '0x9876543210fedcba9876543210fedcba98765432',
    budget: '25000',
    category: 'Environment',
    status: 'succeeded',
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
    startBlock: 999000,
    endBlock: 1000000,
    votesFor: 2100,
    votesAgainst: 400,
    votesAbstain: 100,
    totalVotes: 2600,
    quorum: 1000,
    executed: true,
    canceled: false,
    ipfsHash: 'QmMockHash2',
    txHash: '0xMockTxHash2'
  }
];

// Initialize with mock data
proposals = [...mockProposals];

const proposalService = {
  // Get all proposals with filters
  async getProposals(filters = {}, sortOptions = {}, pagination = {}) {
    let filteredProposals = [...proposals];

    // Apply filters
    if (filters.status) {
      filteredProposals = filteredProposals.filter(p => p.status === filters.status);
    }
    if (filters.category) {
      filteredProposals = filteredProposals.filter(p => p.category === filters.category);
    }
    if (filters.proposer) {
      filteredProposals = filteredProposals.filter(p => p.proposer.toLowerCase().includes(filters.proposer.toLowerCase()));
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProposals = filteredProposals.filter(p => 
        p.title.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    const { field = 'createdAt', order = 'desc' } = sortOptions;
    filteredProposals.sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (order === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    // Apply pagination
    const { page = 1, limit = 10 } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProposals = filteredProposals.slice(startIndex, endIndex);

    return {
      proposals: paginatedProposals,
      pagination: {
        page,
        limit,
        total: filteredProposals.length,
        pages: Math.ceil(filteredProposals.length / limit)
      }
    };
  },

  // Get proposal by ID
  async getProposalById(id) {
    return proposals.find(p => p.id === id);
  },

  // Create new proposal
  async createProposal(proposalData) {
    const proposal = {
      id: uuidv4(),
      ...proposalData,
      createdAt: Date.now(),
      votesFor: 0,
      votesAgainst: 0,
      votesAbstain: 0,
      totalVotes: 0,
      executed: false,
      canceled: false
    };
    
    proposals.push(proposal);
    return proposal;
  },

  // Update proposal
  async updateProposal(id, updateData, userAddress) {
    const proposalIndex = proposals.findIndex(p => p.id === id);
    if (proposalIndex === -1) {
      throw new Error('Proposal not found');
    }

    // Check if user is the proposer
    if (proposals[proposalIndex].proposer !== userAddress) {
      throw new Error('Unauthorized: Only the proposer can update this proposal');
    }

    proposals[proposalIndex] = { ...proposals[proposalIndex], ...updateData };
    return proposals[proposalIndex];
  },

  // Delete proposal
  async deleteProposal(id, userAddress) {
    const proposalIndex = proposals.findIndex(p => p.id === id);
    if (proposalIndex === -1) {
      throw new Error('Proposal not found');
    }

    // Check if user is the proposer
    if (proposals[proposalIndex].proposer !== userAddress) {
      throw new Error('Unauthorized: Only the proposer can delete this proposal');
    }

    proposals.splice(proposalIndex, 1);
    return true;
  },

  // Add vote to proposal
  async addVote(proposalId, voteData) {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    // Check if user already voted
    const existingVote = votes.find(v => v.proposalId === proposalId && v.voter === voteData.voter);
    if (existingVote) {
      throw new Error('User has already voted on this proposal');
    }

    const vote = {
      id: uuidv4(),
      proposalId,
      ...voteData,
      createdAt: new Date()
    };

    votes.push(vote);

    // Update proposal vote counts
    if (voteData.support === 'for') {
      proposal.votesFor += 1;
    } else if (voteData.support === 'against') {
      proposal.votesAgainst += 1;
    } else if (voteData.support === 'abstain') {
      proposal.votesAbstain += 1;
    }
    proposal.totalVotes += 1;

    return vote;
  },

  // Get proposal votes
  async getProposalVotes(proposalId) {
    return votes.filter(v => v.proposalId === proposalId);
  },

  // Add comment to proposal
  async addComment(proposalId, commentData) {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    const comment = {
      id: uuidv4(),
      proposalId,
      ...commentData,
      createdAt: new Date()
    };

    comments.push(comment);
    return comment;
  },

  // Get proposal comments
  async getProposalComments(proposalId) {
    return comments.filter(c => c.proposalId === proposalId);
  },

  // Get proposal analytics
  async getProposalAnalytics(proposalId) {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    const proposalVotes = votes.filter(v => v.proposalId === proposalId);
    const proposalComments = comments.filter(c => c.proposalId === proposalId);

    return {
      proposal,
      voteDistribution: {
        for: proposal.votesFor,
        against: proposal.votesAgainst,
        abstain: proposal.votesAbstain,
        total: proposal.totalVotes
      },
      participationRate: proposal.totalVotes / 1000, // Assuming 1000 total token holders
      commentCount: proposalComments.length,
      recentActivity: [
        ...proposalVotes.slice(-5).map(v => ({ type: 'vote', data: v })),
        ...proposalComments.slice(-5).map(c => ({ type: 'comment', data: c }))
      ].sort((a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt))
    };
  },

  // Search proposals
  async searchProposals(query, pagination = {}) {
    const searchTerm = query.toLowerCase();
    const filteredProposals = proposals.filter(p => 
      p.title.toLowerCase().includes(searchTerm) || 
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );

    const { page = 1, limit = 10 } = pagination;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProposals = filteredProposals.slice(startIndex, endIndex);

    return {
      proposals: paginatedProposals,
      pagination: {
        page,
        limit,
        total: filteredProposals.length,
        pages: Math.ceil(filteredProposals.length / limit)
      }
    };
  }
};

module.exports = proposalService;
