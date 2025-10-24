// Contract addresses - update these after deployment
const CONTRACT_ADDRESSES = {
  CIVIC_TOKEN: process.env.CIVIC_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  CIVIC_DAO: process.env.CIVIC_DAO_ADDRESS || '0x0000000000000000000000000000000000000000',
  TIMELOCK: process.env.TIMELOCK_ADDRESS || '0x0000000000000000000000000000000000000000',
};

// Network configuration
const NETWORKS = {
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
  },
  polygonAmoy: {
    chainId: 80002,
    name: 'Polygon Amoy',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    blockExplorer: 'https://amoy.polygonscan.com'
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};

// Governance parameters
const GOVERNANCE_PARAMS = {
  VOTING_DELAY: 1, // 1 block
  VOTING_PERIOD: 40320, // 1 week (assuming 12s block time)
  PROPOSAL_THRESHOLD: '1000000000000000000000', // 1000 tokens
  QUORUM_PERCENTAGE: 4, // 4%
  MIN_PROPOSAL_BUDGET: '1000000000000000000000', // 1000 tokens
  MAX_PROPOSAL_BUDGET: '1000000000000000000000000' // 1M tokens
};

module.exports = {
  CONTRACT_ADDRESSES,
  NETWORKS,
  GOVERNANCE_PARAMS
};
