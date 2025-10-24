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
  Tag,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { VoteModal } from '@/components/proposals/vote-modal'
import { apiService } from '@/lib/api-service'
import { smartContractService } from '@/lib/smart-contract-service'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'

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
  executed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  canceled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
}

const statusIcons = {
  active: Clock,
  pending: AlertCircle,
  succeeded: CheckCircle,
  defeated: AlertCircle,
  executed: CheckCircle,
  canceled: AlertCircle
}

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

const statusOptions = [
  'All Statuses',
  'active',
  'pending',
  'succeeded',
  'defeated',
  'executed',
  'canceled'
]

export default function ProposalsPage() {
  const { address, isConnected } = useAccount()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  })

  useEffect(() => {
    loadProposals()
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      loadUserStats()
    }
  }, [isConnected, address])

  const loadProposals = async () => {
    try {
      setLoading(true)
      
      // Try to load from smart contract first, then fallback to API
      try {
        const contractProposals = await smartContractService.getAllProposals(50)
        if (contractProposals && contractProposals.length > 0) {
          setProposals(contractProposals)
        } else {
          // Fallback to API
          const response = await apiService.getProposals({ limit: 50 })
          if (response.success) {
            setProposals(response.data)
          }
        }
      } catch (error) {
        console.log('Contract proposals not available, using API:', error)
        const response = await apiService.getProposals({ limit: 50 })
        if (response.success) {
          setProposals(response.data)
        }
      }
    } catch (error) {
      console.error('Failed to load proposals:', error)
      toast.error('Failed to load proposals')
    } finally {
      setLoading(false)
    }
  }

  const loadUserStats = async () => {
    if (!address) return

    try {
      const [votingPower, tokenBalance, isVerified] = await Promise.all([
        smartContractService.getVotingPower(address),
        smartContractService.getTokenBalance(address),
        smartContractService.isIdentityVerified(address)
      ])

      setUserStats({
        votingPower: votingPower.toString(),
        tokenBalance: tokenBalance.toString(),
        proposalsCreated: 0, // Would need to track this
        votesCast: 0, // Would need to track this
        isVerified
      })
    } catch (error) {
      console.log('User stats not available:', error)
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
    loadProposals() // Refresh data
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

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount || '0'))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getVotingProgress = (proposal: Proposal) => {
    const total = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
    if (total === 0) return 0
    return (proposal.votesFor / total) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading proposals...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Governance Proposals
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Participate in community decision-making and shape the future of our city
                </p>
              </div>
              <Link href="/create">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Proposal
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Proposals</p>
                    <p className="text-2xl font-bold">{proposals.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Proposals</p>
                    <p className="text-2xl font-bold">
                      {proposals.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Votes</p>
                    <p className="text-2xl font-bold">
                      {proposals.reduce((sum, p) => sum + p.totalVotes, 0).toLocaleString()}
                    </p>
                  </div>
                  <Vote className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Your Voting Power</p>
                    <p className="text-2xl font-bold">
                      {userStats ? parseFloat(userStats.votingPower).toLocaleString() : '0'}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search proposals..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status === 'All Statuses' ? 'all' : status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setFilters({ status: 'all', category: 'all', search: '' })}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No proposals found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                  {filters.search || filters.status !== 'all' || filters.category !== 'all'
                    ? 'Try adjusting your filters to see more proposals.'
                    : 'Be the first to create a proposal for the community.'}
                </p>
                <Link href="/create">
                  <Button>Create First Proposal</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredProposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(proposal.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(proposal.status)}
                              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                            </div>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {proposal.category}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {proposal.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {proposal.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(proposal.budget)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(proposal.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col items-end gap-2">
                        <Link href={`/proposals/${proposal.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                        
                        {proposal.status === 'active' && isConnected && userStats?.isVerified && !proposal.hasVoted && (
                          <Button
                            size="sm"
                            onClick={() => handleVote(proposal)}
                          >
                            <Vote className="h-4 w-4 mr-1" />
                            Vote
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Voting Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Voting Progress</span>
                        <span className="font-medium">
                          {getVotingProgress(proposal).toFixed(1)}% For
                        </span>
                      </div>
                      <Progress value={getVotingProgress(proposal)} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{proposal.votesFor} For</span>
                        <span>{proposal.votesAgainst} Against</span>
                        <span>{proposal.votesAbstain} Abstain</span>
                        <span>{proposal.totalVotes} Total</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Vote Modal */}
      {selectedProposal && (
        <VoteModal
          proposal={selectedProposal}
          userVotingPower={userStats ? parseFloat(userStats.votingPower) : 0}
          hasVoted={selectedProposal.hasVoted || false}
          userVote={selectedProposal.userVote}
          onVoteSubmitted={handleVoteSubmitted}
          onClose={() => setSelectedProposal(null)}
        />
      )}
    </div>
  )
}
