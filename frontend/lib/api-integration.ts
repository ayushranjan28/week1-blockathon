// Civic DAO - API Integration Library
// This file contains all API integrations for the governance platform

import { createPublicClient, http, getContract } from 'viem'
import { mainnet, polygon, polygonAmoy } from 'viem/chains'

// ===========================================
// BLOCKCHAIN API CONFIGURATION
// ===========================================

// Alchemy Configuration
export const alchemyConfig = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: process.env.NEXT_PUBLIC_ALCHEMY_NETWORK || 'polygon-mainnet',
  baseURL: `https://${process.env.NEXT_PUBLIC_ALCHEMY_NETWORK || 'polygon-mainnet'}.g.alchemy.com/v2`
}

// Create blockchain clients
export const polygonClient = createPublicClient({
  chain: polygon,
  transport: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
})

export const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
})

export const testnetClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(`https://polygon-amoy.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
})

// ===========================================
// GOVERNANCE API INTEGRATION
// ===========================================

export class GovernanceAPI {
  private baseURL = 'https://api.tally.xyz'
  private apiKey = process.env.NEXT_PUBLIC_TALLY_API_KEY
  private daoId = process.env.NEXT_PUBLIC_TALLY_DAO_ID

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Governance API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get all proposals for the DAO
  async getProposals(params?: {
    limit?: number
    offset?: number
    status?: 'active' | 'succeeded' | 'defeated' | 'executed' | 'canceled'
  }) {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.status) queryParams.append('status', params.status)

    return this.makeRequest(`/daos/${this.daoId}/proposals?${queryParams}`)
  }

  // Get specific proposal details
  async getProposal(proposalId: string) {
    return this.makeRequest(`/proposals/${proposalId}`)
  }

  // Get voting history for an address
  async getVotingHistory(address: string) {
    return this.makeRequest(`/voters/${address}/votes`)
  }

  // Get DAO metrics and analytics
  async getDAOMetrics() {
    return this.makeRequest(`/daos/${this.daoId}/metrics`)
  }

  // Get recent activity
  async getRecentActivity(limit = 10) {
    return this.makeRequest(`/daos/${this.daoId}/activity?limit=${limit}`)
  }
}

// ===========================================
// IPFS INTEGRATION
// ===========================================

export class IPFSService {
  private pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
  private pinataSecret = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
  private gatewayURL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/'

  // Upload file to IPFS via Pinata
  async uploadFile(file: File, metadata?: {
    name?: string
    description?: string
    keyvalues?: Record<string, string>
  }) {
    const formData = new FormData()
    formData.append('file', file)
    
    if (metadata) {
      formData.append('pinataMetadata', JSON.stringify({
        name: metadata.name || file.name,
        keyvalues: metadata.keyvalues || {}
      }))
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': this.pinataApiKey!,
        'pinata_secret_api_key': this.pinataSecret!,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`IPFS Upload Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    return {
      hash: result.IpfsHash,
      url: `${this.gatewayURL}${result.IpfsHash}`,
      size: result.PinSize
    }
  }

  // Upload JSON data to IPFS
  async uploadJSON(data: any, name?: string) {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': this.pinataApiKey!,
        'pinata_secret_api_key': this.pinataSecret!,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: name || 'civic-dao-data'
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`IPFS JSON Upload Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    return {
      hash: result.IpfsHash,
      url: `${this.gatewayURL}${result.IpfsHash}`
    }
  }

  // Get file from IPFS
  async getFile(hash: string) {
    const response = await fetch(`${this.gatewayURL}${hash}`)
    if (!response.ok) {
      throw new Error(`IPFS Get Error: ${response.status} ${response.statusText}`)
    }
    return response
  }
}

// ===========================================
// ZK-PROOF IDENTITY INTEGRATION
// ===========================================

export class ZKProofService {
  private worldIdAppId = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID
  private worldIdActionId = process.env.NEXT_PUBLIC_WORLD_ID_ACTION_ID

  // Verify World ID proof
  async verifyWorldID(proof: string, merkleRoot: string, nullifierHash: string) {
    try {
      // In a real implementation, you would verify the proof on-chain
      // For now, we'll simulate the verification
      const isValid = await this.validateProof(proof, merkleRoot, nullifierHash)
      
      if (isValid) {
        return {
          verified: true,
          identityHash: this.generateIdentityHash(proof),
          timestamp: Date.now()
        }
      }
      
      throw new Error('Invalid ZK proof')
    } catch (error) {
      console.error('ZK Proof verification failed:', error)
      throw error
    }
  }

  // Generate identity hash from proof
  private generateIdentityHash(proof: string): string {
    // In a real implementation, this would be generated from the proof
    return `0x${Math.random().toString(16).substr(2, 64)}`
  }

  // Validate proof (simplified)
  private async validateProof(proof: string, merkleRoot: string, nullifierHash: string): Promise<boolean> {
    // In a real implementation, this would validate the ZK proof
    // For now, we'll return true for demonstration
    return true
  }
}

// ===========================================
// ANALYTICS INTEGRATION
// ===========================================

export class AnalyticsService {
  private mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

  // Track user events
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && this.mixpanelToken) {
      // In a real implementation, you would use the Mixpanel SDK
      console.log('Analytics Event:', eventName, properties)
    }
  }

  // Track governance events
  trackGovernanceEvent(event: 'proposal_created' | 'vote_cast' | 'proposal_executed', data: any) {
    this.trackEvent(`governance_${event}`, {
      ...data,
      timestamp: Date.now(),
      platform: 'civic-dao'
    })
  }

  // Track user engagement
  trackEngagement(action: string, metadata?: Record<string, any>) {
    this.trackEvent('user_engagement', {
      action,
      ...metadata,
      timestamp: Date.now()
    })
  }
}

// ===========================================
// SMART CONTRACT INTEGRATION
// ===========================================

export class SmartContractService {
  private client = polygonClient

  // Get contract instance
  getContract(address: string, abi: any) {
    return getContract({
      address: address as `0x${string}`,
      abi,
      client: this.client
    })
  }

  // Read contract data
  async readContract(contractAddress: string, abi: any, functionName: string, args?: any[]) {
    const contract = this.getContract(contractAddress, abi)
    return contract.read[functionName](args || [])
  }

  // Write contract (requires wallet connection)
  async writeContract(contractAddress: string, abi: any, functionName: string, args?: any[], account?: string) {
    const contract = this.getContract(contractAddress, abi)
    return contract.write[functionName](args || [], { account: account as `0x${string}` })
  }

  // Get proposal data from contract
  async getProposal(proposalId: string, contractAddress: string, abi: any) {
    return this.readContract(contractAddress, abi, 'proposals', [proposalId])
  }

  // Cast vote on proposal
  async castVote(proposalId: string, support: number, reason: string, contractAddress: string, abi: any, account: string) {
    return this.writeContract(contractAddress, abi, 'castVoteWithReason', [proposalId, support, reason], account)
  }
}

// ===========================================
// API SERVICE FACTORY
// ===========================================

export class APIServiceFactory {
  private static instances: Record<string, any> = {}

  static getGovernanceAPI(): GovernanceAPI {
    if (!this.instances.governance) {
      this.instances.governance = new GovernanceAPI()
    }
    return this.instances.governance
  }

  static getIPFSService(): IPFSService {
    if (!this.instances.ipfs) {
      this.instances.ipfs = new IPFSService()
    }
    return this.instances.ipfs
  }

  static getZKProofService(): ZKProofService {
    if (!this.instances.zkProof) {
      this.instances.zkProof = new ZKProofService()
    }
    return this.instances.zkProof
  }

  static getAnalyticsService(): AnalyticsService {
    if (!this.instances.analytics) {
      this.instances.analytics = new AnalyticsService()
    }
    return this.instances.analytics
  }

  static getSmartContractService(): SmartContractService {
    if (!this.instances.smartContract) {
      this.instances.smartContract = new SmartContractService()
    }
    return this.instances.smartContract
  }
}

// ===========================================
// ERROR HANDLING
// ===========================================

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public apiName?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export const handleAPIError = (error: any, apiName: string): string => {
  console.error(`${apiName} API Error:`, error)

  if (error.status === 429) {
    return 'Rate limit exceeded. Please try again later.'
  }

  if (error.status === 401) {
    return 'API key invalid. Please check your configuration.'
  }

  if (error.status === 403) {
    return 'Access forbidden. Please check your permissions.'
  }

  if (error.status >= 500) {
    return 'Server error. Please try again later.'
  }

  return 'An unexpected error occurred. Please try again.'
}

// ===========================================
// USAGE EXAMPLES
// ===========================================

/*
// Example usage in your components:

// 1. Get governance data
const governanceAPI = APIServiceFactory.getGovernanceAPI()
const proposals = await governanceAPI.getProposals({ limit: 10 })

// 2. Upload files to IPFS
const ipfsService = APIServiceFactory.getIPFSService()
const result = await ipfsService.uploadFile(file, { name: 'proposal-document' })

// 3. Verify ZK proof
const zkService = APIServiceFactory.getZKProofService()
const verification = await zkService.verifyWorldID(proof, merkleRoot, nullifierHash)

// 4. Track analytics
const analytics = APIServiceFactory.getAnalyticsService()
analytics.trackGovernanceEvent('proposal_created', { proposalId: '123' })

// 5. Interact with smart contracts
const contractService = APIServiceFactory.getSmartContractService()
const proposal = await contractService.getProposal('1', contractAddress, abi)
*/
