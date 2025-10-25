// Smart Contract Service for Civic DAO
import { 
  createPublicClient, 
  createWalletClient, 
  http, 
  getContract,
  parseEther,
  formatEther,
  parseUnits,
  formatUnits
} from 'viem'
import { polygonAmoy, polygon, sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { 
  CIVIC_DAO_ABI, 
  CIVIC_TOKEN_ABI, 
  CONTRACT_ADDRESSES, 
  ProposalState
} from './contracts'

// Vote support enum
export enum VoteSupport {
  Against = 0,
  For = 1,
  Abstain = 2
}

// Create blockchain clients
const getChain = () => {
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '80002')
  switch (chainId) {
    case 80002: return polygonAmoy
    case 137: return polygon
    case 11155111: return sepolia
    default: return polygonAmoy
  }
}

const chain = getChain()
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc-amoy.polygon.technology'

export const publicClient = createPublicClient({
  chain,
  transport: http(rpcUrl)
})

export class SmartContractService {
  private publicClient
  private chain

  constructor() {
    this.publicClient = publicClient
    this.chain = chain
  }

  // Get contract instances
  private getCivicDAOContract() {
    return getContract({
      address: CONTRACT_ADDRESSES.CIVIC_DAO as `0x${string}`,
      abi: CIVIC_DAO_ABI,
      client: this.publicClient
    })
  }

  private getCivicTokenContract() {
    return getContract({
      address: CONTRACT_ADDRESSES.CIVIC_TOKEN as `0x${string}`,
      abi: CIVIC_TOKEN_ABI,
      client: this.publicClient
    })
  }

  // Proposal Management
  async getAllProposals(limit = 50): Promise<any[]> {
    try {
      // Note: This would need to be implemented based on your contract structure
      // For now, we'll return empty array as we can't iterate all proposals
      console.log('Getting all proposals from contract...')
      return []
    } catch (error) {
      console.error('Error getting proposals:', error)
      throw new Error('Failed to fetch proposals from contract')
    }
  }

  async getProposal(proposalId: number | string) {
    try {
      const daoContract = this.getCivicDAOContract()
      
      // Get basic proposal data
      const [proposalData, state, snapshot, deadline] = await Promise.all([
        daoContract.read.getProposalData([BigInt(proposalId)]),
        daoContract.read.state([BigInt(proposalId)]),
        daoContract.read.proposalSnapshot([BigInt(proposalId)]),
        daoContract.read.proposalDeadline([BigInt(proposalId)])
      ])

      return {
        id: proposalId.toString(),
        title: proposalData.title,
        description: proposalData.description,
        budget: formatEther(proposalData.budget),
        category: proposalData.category,
        proposer: proposalData.proposer,
        createdAt: Number(proposalData.createdAt) * 1000,
        state: ProposalState[Number(state)],
        snapshot: Number(snapshot),
        deadline: Number(deadline) * 1000,
        // These would need to be fetched from vote counting functions
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        totalVotes: 0,
        quorum: await this.getQuorum(Number(snapshot))
      }
    } catch (error) {
      console.error('Error getting proposal:', error)
      throw new Error('Failed to fetch proposal from contract')
    }
  }

  async getQuorum(blockNumber: number): Promise<number> {
    try {
      const daoContract = this.getCivicDAOContract()
      const quorum = await daoContract.read.quorum([BigInt(blockNumber)])
      return Number(quorum)
    } catch (error) {
      console.error('Error getting quorum:', error)
      return 0
    }
  }

  async createProposal(
    targets: string[],
    values: bigint[],
    calldatas: `0x${string}`[],
    description: string,
    title: string,
    budget: string,
    category: string,
    account: `0x${string}`,
    walletClient: any
  ) {
    try {
      const daoContract = getContract({
        address: CONTRACT_ADDRESSES.CIVIC_DAO as `0x${string}`,
        abi: CIVIC_DAO_ABI,
        client: walletClient
      }) as any

      const budgetWei = parseEther(budget)

      const hash = await daoContract.write.proposeWithBudget([
        targets as `0x${string}`[],
        values,
        calldatas,
        description,
        title,
        budgetWei,
        category
      ], {
        account
      })

      return { hash, success: true }
    } catch (error) {
      console.error('Error creating proposal:', error)
      throw new Error('Failed to create proposal on contract')
    }
  }

  // Voting
  async castVote(
    proposalId: number | string,
    support: VoteSupport,
    reason: string,
    account: `0x${string}`,
    walletClient: any
  ) {
    try {
      const daoContract = getContract({
        address: CONTRACT_ADDRESSES.CIVIC_DAO as `0x${string}`,
        abi: CIVIC_DAO_ABI,
        client: walletClient
      }) as any

      const hash = await daoContract.write.castVoteWithReason([
        BigInt(proposalId),
        support,
        reason
      ], {
        account
      })

      return { hash, success: true }
    } catch (error) {
      console.error('Error casting vote:', error)
      throw new Error('Failed to cast vote on contract')
    }
  }

  // Token/Identity Management
  async getVotingPower(address: `0x${string}`): Promise<number> {
    try {
      const tokenContract = this.getCivicTokenContract()
      const votingPower = await tokenContract.read.getVotes([address])
      return Number(formatEther(votingPower))
    } catch (error) {
      console.error('Error getting voting power:', error)
      return 0
    }
  }

  async getTokenBalance(address: `0x${string}`): Promise<number> {
    try {
      const tokenContract = this.getCivicTokenContract()
      const balance = await tokenContract.read.balanceOf([address])
      return Number(formatEther(balance))
    } catch (error) {
      console.error('Error getting token balance:', error)
      return 0
    }
  }

  async isIdentityVerified(address: `0x${string}`): Promise<boolean> {
    try {
      const daoContract = this.getCivicDAOContract()
      const isVerified = await daoContract.read.verifiedIdentities([address])
      return isVerified
    } catch (error) {
      console.error('Error checking identity verification:', error)
      return false
    }
  }

  async verifyIdentity(
    identityHash: `0x${string}`,
    proof: `0x${string}`,
    account: `0x${string}`,
    walletClient: any
  ) {
    try {
      const daoContract = getContract({
        address: CONTRACT_ADDRESSES.CIVIC_DAO as `0x${string}`,
        abi: CIVIC_DAO_ABI,
        client: walletClient
      }) as any

      const hash = await daoContract.write.verifyZKIdentity([
        identityHash,
        proof
      ], {
        account
      })

      return { hash, success: true }
    } catch (error) {
      console.error('Error verifying identity:', error)
      throw new Error('Failed to verify identity on contract')
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const daoContract = this.getCivicDAOContract()
      const categories = await daoContract.read.getCategories()
      return [...categories]
    } catch (error) {
      console.error('Error getting categories:', error)
      return []
    }
  }

  // Utility functions
  async getContractAddresses() {
    return {
      civicDAO: CONTRACT_ADDRESSES.CIVIC_DAO,
      civicToken: CONTRACT_ADDRESSES.CIVIC_TOKEN,
      timelock: CONTRACT_ADDRESSES.TIMELOCK,
      chainId: this.chain.id,
      chainName: this.chain.name
    }
  }

  async getProposalState(proposalId: number | string): Promise<ProposalState> {
    try {
      const daoContract = this.getCivicDAOContract()
      const state = await daoContract.read.state([BigInt(proposalId)])
      return Number(state) as ProposalState
    } catch (error) {
      console.error('Error getting proposal state:', error)
      return ProposalState.Pending
    }
  }

  // Transaction helpers
  async waitForTransaction(hash: `0x${string}`) {
    try {
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash })
      return receipt
    } catch (error) {
      console.error('Error waiting for transaction:', error)
      throw error
    }
  }
}

// Singleton instance
export const smartContractService = new SmartContractService()

// Helper functions for UI
export const formatVoteSupport = (support: VoteSupport): string => {
  switch (support) {
    case VoteSupport.Against:
      return 'Against'
    case VoteSupport.For:
      return 'For'
    case VoteSupport.Abstain:
      return 'Abstain'
    default:
      return 'Unknown'
  }
}

export const getProposalStateText = (state: ProposalState): string => {
  switch (state) {
    case ProposalState.Pending:
      return 'Pending'
    case ProposalState.Active:
      return 'Active'
    case ProposalState.Canceled:
      return 'Canceled'
    case ProposalState.Defeated:
      return 'Defeated'
    case ProposalState.Succeeded:
      return 'Succeeded'
    case ProposalState.Queued:
      return 'Queued'
    case ProposalState.Expired:
      return 'Expired'
    case ProposalState.Executed:
      return 'Executed'
    default:
      return 'Unknown'
  }
}
