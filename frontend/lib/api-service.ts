// API integration service for Civic DAO frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async authenticate(address: string, signature: string, message: string) {
    const response = await this.request<{
      success: boolean;
      data: {
        user: any;
        token: string;
      };
      message: string;
    }>('/users/auth', {
      method: 'POST',
      body: JSON.stringify({ address, signature, message }),
    });

    if (response.success && response.data.token) {
      this.token = response.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token);
      }
    }

    return response;
  }

  // User management
  async getUserProfile(address: string) {
    return this.request<{
      success: boolean;
      data: {
        user: any;
        votingPower: any;
        identity: any;
      };
    }>(`/users/${address}`);
  }

  async updateUserProfile(address: string, data: any) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/users/${address}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async submitZKProof(address: string, identityHash: string, proof: string, metadata: string) {
    return this.request<{
      success: boolean;
      data: { txHash: string };
      message: string;
    }>(`/users/${address}/verify`, {
      method: 'POST',
      body: JSON.stringify({ identityHash, proof, metadata }),
    });
  }

  async getUserStats(address: string) {
    return this.request<{
      success: boolean;
      data: {
        votingPower: string;
        tokenBalance: string;
        proposalsCreated: number;
        votesCast: number;
        isVerified: boolean;
      };
    }>(`/users/${address}/stats`);
  }

  // Proposal management
  async getProposals(params: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    proposer?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<{
      success: boolean;
      data: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/proposals?${searchParams.toString()}`);
  }

  async getProposalById(id: string) {
    return this.request<{
      success: boolean;
      data: any;
    }>(`/proposals/${id}`);
  }

  async createProposal(data: {
    title: string;
    description: string;
    category: string;
    budget: string;
    targets?: string[];
    values?: number[];
    calldatas?: string[];
    attachments?: any[];
  }) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>('/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async voteOnProposal(id: string, support: number, reason?: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/proposals/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ support, reason }),
    });
  }

  async getProposalVotes(id: string) {
    return this.request<{
      success: boolean;
      data: any[];
    }>(`/proposals/${id}/votes`);
  }

  async getProposalComments(id: string) {
    return this.request<{
      success: boolean;
      data: any[];
    }>(`/proposals/${id}/comments`);
  }

  async addComment(id: string, content: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/proposals/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getProposalAnalytics(id: string) {
    return this.request<{
      success: boolean;
      data: any;
    }>(`/proposals/${id}/analytics`);
  }

  // Governance
  async getGovernanceStats() {
    return this.request<{
      success: boolean;
      data: {
        votingDelay: number;
        votingPeriod: number;
        proposalThreshold: string;
        quorumVotes: string;
        timelockDelay: number;
        totalProposals: number;
        activeProposals: number;
        executedProposals: number;
        treasuryBalance: string;
        recentProposals: any[];
      };
    }>('/governance/stats');
  }

  async getUserVotingPower(address: string) {
    return this.request<{
      success: boolean;
      data: {
        address: string;
        balance: string;
        votingPower: string;
        delegatedTo: string | null;
        delegatedFrom: string[];
      };
    }>(`/governance/voting-power/${address}`);
  }

  async delegateVotingPower(delegatee: string) {
    return this.request<{
      success: boolean;
      data: { txHash: string };
      message: string;
    }>('/governance/delegate', {
      method: 'POST',
      body: JSON.stringify({ delegatee }),
    });
  }

  async executeProposal(id: string) {
    return this.request<{
      success: boolean;
      data: { txHash: string };
      message: string;
    }>(`/governance/execute/${id}`, {
      method: 'POST',
    });
  }

  async getTransactionStatus(txHash: string) {
    return this.request<{
      success: boolean;
      data: {
        hash: string;
        status: string;
        blockNumber: number | null;
        gasUsed: string | null;
        gasPrice: string | null;
      };
    }>(`/governance/transaction/${txHash}`);
  }

  // IPFS
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/ipfs/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  }

  async uploadJSON(data: any) {
    return this.request<{
      success: boolean;
      data: { hash: string; url: string };
      message: string;
    }>('/ipfs/upload-json', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  async getIPFSFile(hash: string) {
    return fetch(`${this.baseUrl}/ipfs/${hash}`).then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      return response;
    });
  }

  async getIPFSMetadata(hash: string) {
    return this.request<{
      success: boolean;
      data: {
        hash: string;
        type: string;
        url: string;
        metadata?: any;
      };
    }>(`/ipfs/${hash}/metadata`);
  }

  // Blockchain interaction helpers
  async waitForTransaction(txHash: string, maxAttempts: number = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const status = await this.getTransactionStatus(txHash);
        if (status.data.status === 'confirmed') {
          return status.data;
        }
        if (status.data.status === 'failed') {
          throw new Error('Transaction failed');
        }
        // Wait 2 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        if (i === maxAttempts - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    throw new Error('Transaction timeout');
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  isAuthenticated() {
    return !!this.token;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
