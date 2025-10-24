'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Vote, 
  FileText, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  BarChart3,
  DollarSign,
  Calendar,
  Tag
} from 'lucide-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { EnhancedProgress } from '@/components/ui/enhanced-progress'
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText } from '@/components/ui/responsive-container'
import { VoteModal } from '@/components/proposals/vote-modal'
import { apiService } from '@/lib/api-service'
import { smartContractService } from '@/lib/smart-contract-service'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import Link from 'next/link'

interface Proposal {
  id: string
  title: string
  description: string
  proposer: string
  category: string
  budget: string
  status: string
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  totalVotes: number
  createdAt: string
  deadline: string
  hasVoted?: boolean
  userVote?: number
}

interface UserStats {
  votingPower: string
  tokenBalance: string
  proposalsCreated: number
  votesCast: number
  isVerified: boolean
}

const statusColors = {
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  succeeded: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  defeated: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  executed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
}

const statusIcons = {
  active: Clock,
  pending: AlertCircle,
  succeeded: CheckCircle,
  defeated: AlertCircle,
  executed: CheckCircle
}

export function CitizenDashboard() {
  const { address, isConnected } = useAccount()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [governanceStats, setGovernanceStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  })

  useEffect(() => {
    loadDashboardData()
  }, [isConnected, address])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [proposalsResponse, governanceResponse] = await Promise.all([
        apiService.getProposals({ limit: 20 }),
        apiService.getGovernanceStats()
      ])

      if (proposalsResponse.success) {
        setProposals(proposalsResponse.data)
      }

      if (governanceResponse.success) {
        setGovernanceStats(governanceResponse.data)
      }

      // Load user stats if wallet is connected
      if (isConnected && address) {
        try {
          // Load from smart contract first, then fallback to API
          const [votingPower, tokenBalance, isVerified] = await Promise.all([
            smartContractService.getVotingPower(address),
            smartContractService.getTokenBalance(address),
            smartContractService.isIdentityVerified(address)
          ])

          // Try to get API data as well
          let apiUserStats = null
          try {
            const userStatsResponse = await apiService.getUserStats(address)
            if (userStatsResponse.success) {
              apiUserStats = userStatsResponse.data
            }
          } catch (error) {
            console.log('API user stats not available:', error)
          }

          setUserStats({
            votingPower: votingPower.toString(),
            tokenBalance: tokenBalance.toString(),
            proposalsCreated: apiUserStats?.proposalsCreated || 0,
            votesCast: apiUserStats?.votesCast || 0,
            isVerified
          })
        } catch (error) {
          console.log('Smart contract user stats not available:', error)
          // Fallback to API only
          try {
            const userStatsResponse = await apiService.getUserStats(address)
            if (userStatsResponse.success) {
              setUserStats(userStatsResponse.data)
            }
          } catch (apiError) {
            console.log('No user stats available:', apiError)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = (proposal: Proposal) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!userStats?.isVerified) {
      toast.error('Please verify your identity first')
      return
    }

    setSelectedProposal(proposal)
    setShowVoteModal(true)
  }

  const handleVoteSubmitted = () => {
    loadDashboardData() // Refresh data
    toast.success('Vote submitted successfully!')
  }

  const filteredProposals = proposals.filter(proposal => {
    const matchesStatus = filters.status === 'all' || proposal.status === filters.status
    const matchesCategory = filters.category === 'all' || proposal.category === filters.category
    const matchesSearch = filters.search === '' || 
      proposal.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      proposal.description.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesStatus && matchesCategory && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    const IconComponent = statusIcons[status as keyof typeof statusIcons] || Clock
    return <IconComponent className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || statusColors.pending
  }

  if (loading) {
    return (
      <ResponsiveContainer maxWidth="full" padding="lg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <ResponsiveText color="muted">Loading dashboard...</ResponsiveText>
          </div>
        </div>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer maxWidth="full" padding="lg">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
        >
          <div>
            <ResponsiveText 
              size={{ default: '2xl', sm: '3xl', md: '4xl' }}
              weight="bold"
              className="mb-2"
            >
              Citizen Dashboard
            </ResponsiveText>
            <ResponsiveText 
              size={{ default: 'base', sm: 'lg' }}
              color="muted"
            >
              Participate in transparent city governance
            </ResponsiveText>
          </div>
          <Link href="/create">
            <EnhancedButton variant="primary" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Proposal
            </EnhancedButton>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <ResponsiveGrid cols={{ default: 2, sm: 4 }} gap="md">
          {[
            {
              label: 'Active Proposals',
              value: governanceStats?.activeProposals || 0,
              icon: FileText,
              color: 'text-blue-600 dark:text-blue-400',
              bgColor: 'bg-blue-50 dark:bg-blue-900/20'
            },
            {
              label: 'Your Voting Power',
              value: userStats ? `${parseInt(userStats.votingPower).toLocaleString()} votes` : 'Connect Wallet',
              icon: Vote,
              color: 'text-green-600 dark:text-green-400',
              bgColor: 'bg-green-50 dark:bg-green-900/20'
            },
            {
              label: 'Community Size',
              value: '2.4K',
              icon: Users,
              color: 'text-purple-600 dark:text-purple-400',
              bgColor: 'bg-purple-50 dark:bg-purple-900/20'
            },
            {
              label: 'Treasury Balance',
              value: governanceStats ? `$${parseInt(governanceStats.treasuryBalance).toLocaleString()}` : '$0',
              icon: DollarSign,
              color: 'text-orange-600 dark:text-orange-400',
              bgColor: 'bg-orange-50 dark:bg-orange-900/20'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <EnhancedCard variant="hover" animation="hover">
                <EnhancedCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <ResponsiveText 
                        size={{ default: 'sm' }}
                        color="muted"
                        className="mb-1"
                      >
                        {stat.label}
                      </ResponsiveText>
                      <ResponsiveText 
                        size={{ default: 'lg', sm: 'xl' }}
                        weight="bold"
                      >
                        {stat.value}
                      </ResponsiveText>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            </motion.div>
          ))}
        </ResponsiveGrid>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EnhancedCard variant="glass">
            <EnhancedCardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search proposals..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="succeeded">Succeeded</option>
                  <option value="defeated">Defeated</option>
                  <option value="executed">Executed</option>
                </select>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Safety">Safety</option>
                  <option value="Culture">Culture</option>
                  <option value="Technology">Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>

        {/* Proposals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <EnhancedCard variant="glass">
            <EnhancedCardHeader>
              <EnhancedCardTitle>Proposals ({filteredProposals.length})</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent className="space-y-4">
              {filteredProposals.length === 0 ? (
                <div className="text-center py-12">
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
                  >
                    Try adjusting your filters or check back later
                  </ResponsiveText>
                </div>
              ) : (
                filteredProposals.map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {getStatusIcon(proposal.status)}
                      <div className="flex-1">
                        <Link href={`/proposals/${proposal.id}`}>
                          <ResponsiveText 
                            size={{ default: 'base', sm: 'lg' }}
                            weight="semibold"
                            className="mb-1 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
                          >
                            {proposal.title}
                          </ResponsiveText>
                        </Link>
                        <ResponsiveText 
                          size={{ default: 'sm' }}
                          color="muted"
                          className="mb-2"
                        >
                          {proposal.description.substring(0, 100)}...
                        </ResponsiveText>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-neutral-400">
                          <span className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            {proposal.category}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${parseInt(proposal.budget).toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {proposal.deadline}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <ResponsiveText 
                          size={{ default: 'sm' }}
                          weight="medium"
                          className="mb-1"
                        >
                          {proposal.totalVotes.toLocaleString()} votes
                        </ResponsiveText>
                        <EnhancedProgress
                          value={proposal.votesFor}
                          max={proposal.totalVotes}
                          size="sm"
                          variant="default"
                          className="w-20"
                        />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status}
                      </span>
                      {proposal.status === 'active' && !proposal.hasVoted && (
                        <EnhancedButton 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVote(proposal)}
                        >
                          Vote
                        </EnhancedButton>
                      )}
                      {proposal.hasVoted && (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Voted
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>

        {/* Vote Modal */}
        {showVoteModal && selectedProposal && (
          <VoteModal
            proposal={selectedProposal}
            userVotingPower={userStats ? parseInt(userStats.votingPower) : 0}
            hasVoted={selectedProposal.hasVoted || false}
            userVote={selectedProposal.userVote}
            onVoteSubmitted={handleVoteSubmitted}
            onClose={() => setShowVoteModal(false)}
          />
        )}
      </div>
    </ResponsiveContainer>
  )
}
