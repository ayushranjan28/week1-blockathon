'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EnhancedProgress } from '@/components/ui/enhanced-progress'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText } from '@/components/ui/responsive-container'
import { 
  Proposal, 
  StatusBadge, 
  CategoryBadge, 
  AddressDisplay, 
  CurrencyDisplay, 
  DateDisplay,
  formatAddress,
  formatCurrency,
  formatTimeAgo,
  getStatusColor,
  fadeInUp,
  staggerContainer,
  staggerItem
} from '@/lib/shared'

// Mock data - replace with real data from your API
const mockProposals: Proposal[] = [
  {
    id: 1,
    title: 'Community Garden Initiative',
    description: 'Establish community gardens in three neighborhoods to promote local food production and community engagement.',
    proposer: '0x1234567890123456789012345678901234567890',
    budget: 25000,
    category: 'Environment',
    status: 'active',
    votes: 156,
    totalVotes: 200,
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    deadline: '2024-01-22',
    executed: false,
    canceled: false
  },
  {
    id: 2,
    title: 'Public WiFi Expansion',
    description: 'Expand free public WiFi coverage to underserved areas of the city.',
    proposer: '0x9876543210987654321098765432109876543210',
    budget: 50000,
    category: 'Infrastructure',
    status: 'passed',
    votes: 89,
    totalVotes: 120,
    createdAt: Date.now() - 86400000 * 7, // 1 week ago
    deadline: '2024-01-17',
    executed: true,
    canceled: false
  },
  {
    id: 3,
    title: 'Youth Sports Program',
    description: 'Create after-school sports programs for children aged 8-16.',
    proposer: '0x4567890123456789012345678901234567890123',
    budget: 30000,
    category: 'Education',
    status: 'pending',
    votes: 45,
    totalVotes: 150,
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    deadline: '2024-01-20',
    executed: false,
    canceled: false
  },
  {
    id: 4,
    title: 'Street Lighting Upgrade',
    description: 'Upgrade street lighting to LED technology for better energy efficiency.',
    proposer: '0x2468135790246813579024681357902468135790',
    budget: 75000,
    category: 'Infrastructure',
    status: 'rejected',
    votes: 203,
    totalVotes: 300,
    createdAt: Date.now() - 86400000 * 10, // 10 days ago
    deadline: '2024-01-15',
    executed: false,
    canceled: false
  }
]

const categories = [
  'All Categories',
  'Infrastructure',
  'Environment',
  'Education',
  'Healthcare',
  'Transportation',
  'Safety',
  'Culture',
  'Technology',
  'Other'
]

const statuses = [
  'All Status',
  'active',
  'pending',
  'passed',
  'rejected',
  'executed'
]

interface ProposalManagerProps {
  userType: 'citizen' | 'admin'
  onProposalSelect?: (proposal: Proposal) => void
  onCreateProposal?: () => void
}

export function ProposalManager({ 
  userType, 
  onProposalSelect, 
  onCreateProposal 
}: ProposalManagerProps) {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(false)

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.proposer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All Categories' || proposal.category === categoryFilter
    const matchesStatus = statusFilter === 'All Status' || proposal.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return Number(b.createdAt) - Number(a.createdAt)
      case 'oldest':
        return Number(a.createdAt) - Number(b.createdAt)
      case 'budget-high':
        return Number(b.budget) - Number(a.budget)
      case 'budget-low':
        return Number(a.budget) - Number(b.budget)
      case 'votes':
        return Number(b.votes) - Number(a.votes)
      default:
        return 0
    }
  })

  const handleProposalAction = (proposal: Proposal, action: string) => {
    if (action === 'view' && onProposalSelect) {
      onProposalSelect(proposal)
    } else if (action === 'edit' && userType === 'admin') {
      // Handle edit logic
      console.log('Edit proposal:', proposal.id)
    } else if (action === 'delete' && userType === 'admin') {
      // Handle delete logic
      setProposals(prev => prev.filter(p => p.id !== proposal.id))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'passed':
      case 'executed':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <ResponsiveText 
            size={{ default: 'xl', sm: '2xl', md: '3xl' }}
            weight="bold"
            className="mb-2"
          >
            {userType === 'admin' ? 'Proposal Management' : 'Community Proposals'}
          </ResponsiveText>
          <ResponsiveText 
            size={{ default: 'sm', sm: 'base' }}
            color="muted"
          >
            {userType === 'admin' 
              ? 'Review and manage community proposals' 
              : 'Participate in community decision making'
            }
          </ResponsiveText>
        </div>
        <div className="flex items-center space-x-3">
          {userType === 'citizen' && onCreateProposal && (
            <EnhancedButton 
              variant="gradient" 
              size="sm" 
              animation="glow"
              onClick={onCreateProposal}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Proposal
            </EnhancedButton>
          )}
          <EnhancedButton variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </EnhancedButton>
        </div>
      </div>

      {/* Filters */}
      <EnhancedCard variant="glass">
        <EnhancedCardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget-high">Highest Budget</option>
              <option value="budget-low">Lowest Budget</option>
              <option value="votes">Most Votes</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 dark:border-neutral-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-l-lg ${
                  viewMode === 'grid' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300'
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-r-lg ${
                  viewMode === 'list' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300'
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <ResponsiveText 
          size={{ default: 'lg', sm: 'xl' }}
          weight="semibold"
        >
          {sortedProposals.length} Proposals Found
        </ResponsiveText>
        <ResponsiveText 
          size={{ default: 'sm' }}
          color="muted"
        >
          Showing {sortedProposals.length} of {proposals.length} proposals
        </ResponsiveText>
      </div>

      {/* Proposals Display */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <LoadingSpinner size="lg" />
          <ResponsiveText 
            size={{ default: 'base' }}
            className="ml-3"
          >
            Loading proposals...
          </ResponsiveText>
        </div>
      ) : sortedProposals.length === 0 ? (
        <EnhancedCard variant="glass">
          <EnhancedCardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 dark:text-neutral-600 mx-auto mb-4" />
            <ResponsiveText 
              size={{ default: 'lg', sm: 'xl' }}
              weight="semibold"
              className="mb-2"
            >
              No proposals found
            </ResponsiveText>
            <ResponsiveText 
              size={{ default: 'sm', sm: 'base' }}
              color="muted"
              className="mb-6"
            >
              Try adjusting your search criteria or create a new proposal.
            </ResponsiveText>
            {userType === 'citizen' && onCreateProposal && (
              <EnhancedButton variant="default" onClick={onCreateProposal}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Proposal
              </EnhancedButton>
            )}
          </EnhancedCardContent>
        </EnhancedCard>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
        >
          {sortedProposals.map((proposal) => (
            <motion.div
              key={proposal.id}
              variants={staggerItem}
              className={viewMode === 'grid' ? '' : 'w-full'}
            >
              {viewMode === 'grid' ? (
                <ProposalCard 
                  proposal={proposal} 
                  userType={userType}
                  onAction={handleProposalAction}
                />
              ) : (
                <ProposalListItem 
                  proposal={proposal} 
                  userType={userType}
                  onAction={handleProposalAction}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

interface ProposalCardProps {
  proposal: Proposal
  userType: 'citizen' | 'admin'
  onAction: (proposal: Proposal, action: string) => void
}

function ProposalCard({ proposal, userType, onAction }: ProposalCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'passed':
      case 'executed':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  return (
    <EnhancedCard variant="hover" animation="hover">
      <EnhancedCardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <ResponsiveText 
              size={{ default: 'base', sm: 'lg' }}
              weight="semibold"
              className="mb-2 line-clamp-2"
            >
              {proposal.title}
            </ResponsiveText>
            <ResponsiveText 
              size={{ default: 'sm' }}
              color="muted"
              className="line-clamp-2 mb-3"
            >
              {proposal.description}
            </ResponsiveText>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {getStatusIcon(proposal.status)}
            <StatusBadge status={proposal.status} />
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <ResponsiveText size={{ default: 'sm' }} color="muted">
              Proposer
            </ResponsiveText>
            <AddressDisplay address={proposal.proposer} />
          </div>
          <div className="flex items-center justify-between">
            <ResponsiveText size={{ default: 'sm' }} color="muted">
              Budget
            </ResponsiveText>
            <CurrencyDisplay amount={proposal.budget} />
          </div>
          <div className="flex items-center justify-between">
            <ResponsiveText size={{ default: 'sm' }} color="muted">
              Category
            </ResponsiveText>
            <CategoryBadge category={proposal.category} />
          </div>
          <div className="flex items-center justify-between">
            <ResponsiveText size={{ default: 'sm' }} color="muted">
              Deadline
            </ResponsiveText>
            <DateDisplay timestamp={proposal.deadline} />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <ResponsiveText size={{ default: 'sm' }} color="muted">
              Votes
            </ResponsiveText>
            <ResponsiveText size={{ default: 'sm' }} weight="medium">
              {proposal.votes}/{proposal.totalVotes}
            </ResponsiveText>
          </div>
          <EnhancedProgress
            value={proposal.votes}
            max={proposal.totalVotes}
            size="sm"
            variant="default"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <EnhancedButton 
              variant="outline" 
              size="sm"
              onClick={() => onAction(proposal, 'view')}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </EnhancedButton>
            {userType === 'citizen' && proposal.status === 'active' && (
              <EnhancedButton variant="default" size="sm">
                Vote
              </EnhancedButton>
            )}
          </div>
          {userType === 'admin' && (
            <div className="flex items-center space-x-1">
              <EnhancedButton 
                variant="ghost" 
                size="sm"
                onClick={() => onAction(proposal, 'edit')}
              >
                <Edit className="h-4 w-4" />
              </EnhancedButton>
              <EnhancedButton 
                variant="ghost" 
                size="sm"
                onClick={() => onAction(proposal, 'delete')}
              >
                <Trash2 className="h-4 w-4" />
              </EnhancedButton>
            </div>
          )}
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  )
}

interface ProposalListItemProps {
  proposal: Proposal
  userType: 'citizen' | 'admin'
  onAction: (proposal: Proposal, action: string) => void
}

function ProposalListItem({ proposal, userType, onAction }: ProposalListItemProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'passed':
      case 'executed':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  return (
    <EnhancedCard variant="glass">
      <EnhancedCardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {getStatusIcon(proposal.status)}
            <div className="flex-1">
              <ResponsiveText 
                size={{ default: 'base', sm: 'lg' }}
                weight="semibold"
                className="mb-1"
              >
                {proposal.title}
              </ResponsiveText>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-neutral-400">
                <AddressDisplay address={proposal.proposer} />
                <CurrencyDisplay amount={proposal.budget} />
                <CategoryBadge category={proposal.category} />
                <DateDisplay timestamp={proposal.deadline} />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <ResponsiveText size={{ default: 'sm' }} weight="medium" className="mb-1">
                {proposal.votes}/{proposal.totalVotes} votes
              </ResponsiveText>
              <EnhancedProgress
                value={proposal.votes}
                max={proposal.totalVotes}
                size="sm"
                variant="default"
                className="w-20"
              />
            </div>
            <StatusBadge status={proposal.status} />
            <div className="flex items-center space-x-2">
              <EnhancedButton 
                variant="outline" 
                size="sm"
                onClick={() => onAction(proposal, 'view')}
              >
                <Eye className="h-4 w-4" />
              </EnhancedButton>
              {userType === 'citizen' && proposal.status === 'active' && (
                <EnhancedButton variant="default" size="sm">
                  Vote
                </EnhancedButton>
              )}
              {userType === 'admin' && (
                <>
                  <EnhancedButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onAction(proposal, 'edit')}
                  >
                    <Edit className="h-4 w-4" />
                  </EnhancedButton>
                  <EnhancedButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onAction(proposal, 'delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </EnhancedButton>
                </>
              )}
            </div>
          </div>
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  )
}
