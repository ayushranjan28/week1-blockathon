export interface Proposal {
  id: string
  title: string
  description: string
  proposer: string
  budget: string
  category: string
  status: ProposalStatus
  createdAt: number
  startBlock: number
  endBlock: number
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  totalVotes: number
  quorum: number
  executed: boolean
  canceled: boolean
}

export type ProposalStatus = 
  | 'pending'
  | 'active'
  | 'succeeded'
  | 'defeated'
  | 'executed'
  | 'canceled'
  | 'expired'

export interface Vote {
  voter: string
  support: VoteSupport
  weight: string
  reason?: string
  blockNumber: number
  transactionHash: string
}

export type VoteSupport = 'for' | 'against' | 'abstain'

export interface User {
  address: string
  balance: string
  votingPower: string
  verified: boolean
  identityHash?: string
  joinedAt: number
}

export interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

export interface GovernanceStats {
  totalProposals: number
  activeProposals: number
  totalVotes: number
  participationRate: number
  totalBudget: string
  executedBudget: string
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  read: boolean
}

export interface Theme {
  mode: 'light' | 'dark'
  primary: string
  secondary: string
}

export interface Language {
  code: string
  name: string
  flag: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface FilterOptions {
  status?: ProposalStatus[]
  category?: string[]
  proposer?: string
  dateRange?: {
    start: number
    end: number
  }
  budgetRange?: {
    min: string
    max: string
  }
}

export interface SortOptions {
  field: 'createdAt' | 'budget' | 'votes' | 'deadline'
  direction: 'asc' | 'desc'
}
