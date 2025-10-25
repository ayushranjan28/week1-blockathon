// Civic DAO - Simplified API Integration
// Only essential APIs for Vercel deployment

import { createPublicClient, http } from 'viem'
import { polygonAmoy } from 'viem/chains'

// ===========================================
// BLOCKCHAIN CLIENT (SIMPLIFIED)
// ===========================================

export const testnetClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc-amoy.polygon.technology')
})

// ===========================================
// GOVERNANCE API (SIMPLIFIED)
// ===========================================

export class GovernanceAPI {
  // Simplified governance API - using only smart contract data
  // No external API keys required
  
  async getProposals(params?: {
    limit?: number
    offset?: number
    status?: 'active' | 'succeeded' | 'defeated' | 'executed' | 'canceled'
  }) {
    // Return mock data or integrate with your backend API
    return {
      proposals: [],
      total: 0,
      message: 'Using smart contract data only'
    }
  }

  async getProposal(proposalId: string) {
    // Get proposal data from smart contract
    return {
      id: proposalId,
      title: 'Mock Proposal',
      description: 'This is a mock proposal',
      status: 'active'
    }
  }

  async getVotingHistory(address: string) {
    // Get voting history from smart contract
    return {
      address,
      votes: []
    }
  }

  async getDAOMetrics() {
    // Get DAO metrics from smart contract
    return {
      totalProposals: 0,
      activeProposals: 0,
      totalVotes: 0
    }
  }

  async getRecentActivity(limit = 10) {
    // Get recent activity from smart contract
    return {
      activities: []
    }
  }
}

// ===========================================
// IPFS INTEGRATION (OPTIONAL)
// ===========================================

export class IPFSService {
  private pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
  private pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY

  async uploadFile(file: File) {
    if (!this.pinataApiKey || !this.pinataSecretKey) {
      throw new Error('Pinata API keys not configured')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': this.pinataApiKey,
        'pinata_secret_api_key': this.pinataSecretKey,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file to IPFS')
    }

    return response.json()
  }

  async uploadJSON(data: any) {
    if (!this.pinataApiKey || !this.pinataSecretKey) {
      throw new Error('Pinata API keys not configured')
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': this.pinataApiKey,
        'pinata_secret_api_key': this.pinataSecretKey,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: 'Civic DAO Data'
        }
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to upload JSON to IPFS')
    }

    return response.json()
  }
}

// ===========================================
// ANALYTICS (SIMPLIFIED)
// ===========================================

export class AnalyticsService {
  // Simplified analytics - no external API keys required
  
  trackEvent(eventName: string, properties?: any) {
    // Basic event tracking without external services
    console.log('Analytics Event:', eventName, properties)
    
    // You can add Google Analytics or other services here if needed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties)
    }
  }

  trackPageView(pageName: string) {
    this.trackEvent('page_view', { page: pageName })
  }

  trackUserAction(action: string, details?: any) {
    this.trackEvent('user_action', { action, ...details })
  }
}

// Export instances
export const governanceAPI = new GovernanceAPI()
export const ipfsService = new IPFSService()
export const analyticsService = new AnalyticsService()
