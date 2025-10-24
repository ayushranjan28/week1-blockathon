// Civic DAO Smart Contract ABIs and Integration

// CivicDAO Contract ABI
export const CIVIC_DAO_ABI = [
  // Read functions
  {
    "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
    "name": "proposalData",
    "outputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "budget", "type": "uint256"},
      {"internalType": "string", "name": "category", "type": "string"},
      {"internalType": "address", "name": "proposer", "type": "address"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "verifiedIdentities",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCategories",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
    "name": "getProposalData",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "uint256", "name": "budget", "type": "uint256"},
          {"internalType": "string", "name": "category", "type": "string"},
          {"internalType": "address", "name": "proposer", "type": "address"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"}
        ],
        "internalType": "struct CivicDAO.ProposalData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Write functions
  {
    "inputs": [
      {"internalType": "address[]", "name": "targets", "type": "address[]"},
      {"internalType": "uint256[]", "name": "values", "type": "uint256[]"},
      {"internalType": "bytes[]", "name": "calldatas", "type": "bytes[]"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "uint256", "name": "budget", "type": "uint256"},
      {"internalType": "string", "name": "category", "type": "string"}
    ],
    "name": "proposeWithBudget",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "identityHash", "type": "bytes32"},
      {"internalType": "bytes", "name": "proof", "type": "bytes"}
    ],
    "name": "verifyZKIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Inherited Governor functions
  {
    "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
    "name": "state",
    "outputs": [{"internalType": "enum IGovernor.ProposalState", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
    "name": "proposalSnapshot",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
    "name": "proposalDeadline",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "proposalId", "type": "uint256"},
      {"internalType": "uint8", "name": "support", "type": "uint8"},
      {"internalType": "string", "name": "reason", "type": "string"}
    ],
    "name": "castVoteWithReason",
    "outputs": [{"internalType": "uint256", "name": "balance", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
    "name": "quorum",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// CivicToken Contract ABI
export const CIVIC_TOKEN_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "getVotes",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {"internalType": "uint256", "name": "blockNumber", "type": "uint256"}],
    "name": "getPastVotes",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract addresses - these should be updated after deployment
export const CONTRACT_ADDRESSES = {
  CIVIC_DAO: process.env.NEXT_PUBLIC_CIVIC_DAO_ADDRESS || '0x0000000000000000000000000000000000000000',
  CIVIC_TOKEN: process.env.NEXT_PUBLIC_CIVIC_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  TIMELOCK: process.env.NEXT_PUBLIC_TIMELOCK_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const

// Proposal State enum
export enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7
}

// Vote Support enum
export enum VoteSupport {
  Against = 0,
  For = 1,
  Abstain = 2
}
