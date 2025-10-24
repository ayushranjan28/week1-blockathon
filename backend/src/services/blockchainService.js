const { ethers } = require('ethers');
const { createClient } = require('@pinata/sdk');

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://rpc-amoy.polygon.technology');
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    
    // Contract addresses (update after deployment)
    this.contracts = {
      civicToken: process.env.CIVIC_TOKEN_ADDRESS,
      civicDAO: process.env.CIVIC_DAO_ADDRESS,
      treasury: process.env.TREASURY_ADDRESS,
      zkIdentity: process.env.ZK_IDENTITY_ADDRESS
    };

    // Contract ABIs (simplified for demo)
    this.abis = {
      civicDAO: [
        "function proposeWithBudget(address[] targets, uint256[] values, bytes[] calldatas, string description, string title, uint256 budget, string category) external returns (uint256)",
        "function castVote(uint256 proposalId, uint8 support) external",
        "function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) external",
        "function execute(uint256 proposalId) external",
        "function state(uint256 proposalId) external view returns (uint8)",
        "function getProposalData(uint256 proposalId) external view returns (tuple(string title, string description, uint256 budget, string category, address proposer, uint256 createdAt))",
        "function proposalThreshold() external view returns (uint256)",
        "function votingDelay() external view returns (uint256)",
        "function votingPeriod() external view returns (uint256)",
        "function quorum(uint256 blockNumber) external view returns (uint256)",
        "event ProposalCreatedWithBudget(uint256 indexed proposalId, address indexed proposer, string title, uint256 budget, uint256 deadline)",
        "event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 support, uint256 weight, string reason)"
      ],
      civicToken: [
        "function balanceOf(address account) external view returns (uint256)",
        "function getVotes(address account) external view returns (uint256)",
        "function delegate(address delegatee) external",
        "function delegates(address delegator) external view returns (address)",
        "function totalSupply() external view returns (uint256)"
      ],
      treasury: [
        "function depositFunds(address token, uint256 amount) external",
        "function executeProposal(uint256 proposalId, address token, address recipient, uint256 amount, string memory description) external",
        "function getTokenBalance(address token) external view returns (uint256)",
        "function getSupportedTokens() external view returns (address[])",
        "event FundsDeposited(address indexed token, address indexed from, uint256 amount)",
        "event ProposalExecuted(uint256 indexed proposalId, address indexed token, uint256 amount, address indexed recipient)"
      ],
      zkIdentity: [
        "function submitProof(bytes32 identityHash, bytes calldata proof, string memory metadata) external",
        "function verifyIdentity(address user, bytes32 identityHash, string memory metadata) external",
        "function isVerified(address user) external view returns (bool)",
        "function getIdentity(address user) external view returns (tuple(bytes32 identityHash, uint256 verificationTimestamp, bool isVerified, string metadata, uint256 proofCount))",
        "event IdentityVerified(address indexed user, bytes32 indexed identityHash, uint256 timestamp)",
        "event ProofSubmitted(address indexed user, bytes32 indexed proofHash, uint256 timestamp)"
      ]
    };

    // Initialize contract instances
    this.civicDAO = new ethers.Contract(this.contracts.civicDAO, this.abis.civicDAO, this.wallet);
    this.civicToken = new ethers.Contract(this.contracts.civicToken, this.abis.civicToken, this.wallet);
    this.treasury = new ethers.Contract(this.contracts.treasury, this.abis.treasury, this.wallet);
    this.zkIdentity = new ethers.Contract(this.contracts.zkIdentity, this.abis.zkIdentity, this.wallet);
  }

  // Create a new proposal on the blockchain
  async createProposal(proposalData) {
    try {
      console.log('Creating proposal on blockchain:', proposalData);
      
      const tx = await this.civicDAO.proposeWithBudget(
        proposalData.targets,
        proposalData.values,
        proposalData.calldatas,
        proposalData.description,
        proposalData.title,
        proposalData.budget,
        proposalData.category
      );

      const receipt = await tx.wait();
      console.log('Proposal created successfully:', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw new Error(`Failed to create proposal: ${error.message}`);
    }
  }

  // Vote on a proposal
  async voteOnProposal(proposalId, support, reason = '') {
    try {
      console.log('Voting on proposal:', { proposalId, support, reason });
      
      let tx;
      if (reason) {
        tx = await this.civicDAO.castVoteWithReason(proposalId, support, reason);
      } else {
        tx = await this.civicDAO.castVote(proposalId, support);
      }

      const receipt = await tx.wait();
      console.log('Vote cast successfully:', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error voting on proposal:', error);
      throw new Error(`Failed to vote on proposal: ${error.message}`);
    }
  }

  // Execute a proposal
  async executeProposal(proposalId) {
    try {
      console.log('Executing proposal:', proposalId);
      
      const tx = await this.civicDAO.execute(proposalId);
      const receipt = await tx.wait();
      console.log('Proposal executed successfully:', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error executing proposal:', error);
      throw new Error(`Failed to execute proposal: ${error.message}`);
    }
  }

  // Get proposal details from blockchain
  async getProposalDetails(proposalId) {
    try {
      const [proposalData, state] = await Promise.all([
        this.civicDAO.getProposalData(proposalId),
        this.civicDAO.state(proposalId)
      ]);
    
    return {
      id: proposalId,
        title: proposalData.title,
        description: proposalData.description,
        budget: proposalData.budget.toString(),
        category: proposalData.category,
        proposer: proposalData.proposer,
        createdAt: new Date(Number(proposalData.createdAt) * 1000),
        state: this.getProposalStateName(state)
      };
    } catch (error) {
      console.error('Error getting proposal details:', error);
      throw new Error(`Failed to get proposal details: ${error.message}`);
    }
  }

  // Get user's voting power
  async getVotingPower(userAddress) {
    try {
      const [balance, votes, delegates] = await Promise.all([
        this.civicToken.balanceOf(userAddress),
        this.civicToken.getVotes(userAddress),
        this.civicToken.delegates(userAddress)
      ]);
    
    return {
      address: userAddress,
        balance: balance.toString(),
        votingPower: votes.toString(),
        delegatedTo: delegates,
        delegatedFrom: [] // Would need additional contract calls to get this
      };
    } catch (error) {
      console.error('Error getting voting power:', error);
      throw new Error(`Failed to get voting power: ${error.message}`);
    }
  }

  // Delegate voting power
  async delegateVotingPower(delegatee) {
    try {
      console.log('Delegating voting power to:', delegatee);
      
      const tx = await this.civicToken.delegate(delegatee);
      const receipt = await tx.wait();
      console.log('Voting power delegated successfully:', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error delegating voting power:', error);
      throw new Error(`Failed to delegate voting power: ${error.message}`);
    }
  }

  // Get governance parameters
  async getGovernanceParameters() {
    try {
      const [votingDelay, votingPeriod, proposalThreshold, quorum] = await Promise.all([
        this.civicDAO.votingDelay(),
        this.civicDAO.votingPeriod(),
        this.civicDAO.proposalThreshold(),
        this.civicDAO.quorum(await this.provider.getBlockNumber())
      ]);

    return {
        votingDelay: Number(votingDelay),
        votingPeriod: Number(votingPeriod),
        proposalThreshold: proposalThreshold.toString(),
        quorumVotes: quorum.toString(),
      timelockDelay: 2 * 24 * 60 * 60 // 2 days in seconds
    };
    } catch (error) {
      console.error('Error getting governance parameters:', error);
      throw new Error(`Failed to get governance parameters: ${error.message}`);
    }
  }

  // Get treasury balance
  async getTreasuryBalance(tokenAddress) {
    try {
      const balance = await this.treasury.getTokenBalance(tokenAddress);
      return balance.toString();
    } catch (error) {
      console.error('Error getting treasury balance:', error);
      throw new Error(`Failed to get treasury balance: ${error.message}`);
    }
  }

  // Deposit funds to treasury
  async depositFunds(tokenAddress, amount) {
    try {
      console.log('Depositing funds to treasury:', { tokenAddress, amount });
      
      const tx = await this.treasury.depositFunds(tokenAddress, amount);
      const receipt = await tx.wait();
      console.log('Funds deposited successfully:', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error depositing funds:', error);
      throw new Error(`Failed to deposit funds: ${error.message}`);
    }
  }

  // Submit ZK proof for identity verification
  async submitZKProof(identityHash, proof, metadata) {
    try {
      console.log('Submitting ZK proof:', { identityHash, metadata });
      
      const tx = await this.zkIdentity.submitProof(identityHash, proof, metadata);
      const receipt = await tx.wait();
      console.log('ZK proof submitted successfully:', receipt.transactionHash);
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Error submitting ZK proof:', error);
      throw new Error(`Failed to submit ZK proof: ${error.message}`);
    }
  }

  // Check if user is verified
  async isUserVerified(userAddress) {
    try {
      const isVerified = await this.zkIdentity.isVerified(userAddress);
      return isVerified;
    } catch (error) {
      console.error('Error checking user verification:', error);
      throw new Error(`Failed to check user verification: ${error.message}`);
    }
  }

  // Get user identity
  async getUserIdentity(userAddress) {
    try {
      const identity = await this.zkIdentity.getIdentity(userAddress);
      return {
        identityHash: identity.identityHash,
        verificationTimestamp: new Date(Number(identity.verificationTimestamp) * 1000),
        isVerified: identity.isVerified,
        metadata: identity.metadata,
        proofCount: Number(identity.proofCount)
      };
    } catch (error) {
      console.error('Error getting user identity:', error);
      throw new Error(`Failed to get user identity: ${error.message}`);
    }
  }

  // Get transaction status
  async getTransactionStatus(txHash) {
    try {
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      if (!tx) {
        throw new Error('Transaction not found');
      }
    
    return {
      hash: txHash,
        status: receipt ? (receipt.status === 1 ? 'confirmed' : 'failed') : 'pending',
        blockNumber: receipt ? receipt.blockNumber : null,
        gasUsed: receipt ? receipt.gasUsed.toString() : null,
        gasPrice: tx.gasPrice ? tx.gasPrice.toString() : null
      };
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  // Helper function to convert proposal state number to string
  getProposalStateName(state) {
    const states = {
      0: 'Pending',
      1: 'Active',
      2: 'Canceled',
      3: 'Defeated',
      4: 'Succeeded',
      5: 'Queued',
      6: 'Expired',
      7: 'Executed'
    };
    return states[state] || 'Unknown';
  }

  // Get recent proposals (would need to implement event listening)
  async getRecentProposals(limit = 10) {
    try {
      // This would require implementing event listening or indexing
      // For now, return empty array
      console.log('Getting recent proposals:', limit);
      return [];
    } catch (error) {
      console.error('Error getting recent proposals:', error);
      throw new Error(`Failed to get recent proposals: ${error.message}`);
    }
  }
}

module.exports = new BlockchainService();