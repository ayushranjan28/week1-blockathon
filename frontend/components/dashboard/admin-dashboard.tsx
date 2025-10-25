'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Shield, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Settings,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserX,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EnhancedProgress } from '@/components/ui/enhanced-progress'
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText } from '@/components/ui/responsive-container'
import { apiService } from '@/lib/api-service'

interface AdminStats {
  totalProposals: number
  activeProposals: number
  executedProposals: number
  treasuryBalance: string
  verifiedUsers: number
  totalUsers: number
  participationRate: number
  recentActivity: any[]
}

interface Proposal {
  id: number
  title: string
  description: string
  proposer: string
  status: 'pending' | 'active' | 'passed' | 'failed' | 'executed'
  budget: number
  category: string
  votes: number
  totalVotes: number
  createdAt: string
  deadline: string
  ipfsHash?: string
}

interface User {
  address: string
  isVerified: boolean
  votingPower: number
  proposalsCount: number
  votesCount: number
  joinedAt: string
  lastActive: string
}

interface AdminDashboardProps {
  initialTab?: string
}

export function AdminDashboard(props: AdminDashboardProps = {}) {
  const { initialTab = 'overview' } = props
  const [selectedTab, setSelectedTab] = useState(initialTab || 'overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [governanceStats, proposalsData, usersData] = await Promise.all([
        apiService.getGovernanceStats(),
        apiService.getProposals({ page: 1, limit: 50 }),
        apiService.getProposals({ page: 1, limit: 50 }) // Mock users data for now
      ])

      setStats({
        totalProposals: governanceStats.data.totalProposals || 0,
        activeProposals: governanceStats.data.activeProposals || 0,
        executedProposals: governanceStats.data.executedProposals || 0,
        treasuryBalance: governanceStats.data.treasuryBalance || '$0',
        verifiedUsers: 45, // Mock data
        totalUsers: 120, // Mock data
        participationRate: 68, // Mock data
        recentActivity: [] // Mock data
      })

      setProposals(proposalsData.data || [])
      // Mock users data for now - in real implementation, this would come from a users API
      setUsers([
        { address: '0x1234...5678', isVerified: true, votingPower: 1000, proposalsCount: 3, votesCount: 15, joinedAt: '2024-01-15', lastActive: '2024-01-20' },
        { address: '0x2345...6789', isVerified: false, votingPower: 500, proposalsCount: 1, votesCount: 8, joinedAt: '2024-01-18', lastActive: '2024-01-19' },
        { address: '0x3456...7890', isVerified: true, votingPower: 2000, proposalsCount: 5, votesCount: 25, joinedAt: '2024-01-10', lastActive: '2024-01-20' }
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveProposal = async (proposalId: number) => {
    try {
      await apiService.executeProposal(proposalId.toString())
      loadDashboardData()
    } catch (error) {
      console.error('Error approving proposal:', error)
    }
  }

  const handleRejectProposal = async (proposalId: number) => {
    try {
      // Mock rejection - in real implementation, this would update proposal status
      console.log('Rejecting proposal:', proposalId)
      loadDashboardData()
    } catch (error) {
      console.error('Error rejecting proposal:', error)
    }
  }

  const handleVerifyUser = async (userAddress: string) => {
    try {
      // In real implementation, this would call the API to verify user
      await apiService.updateUserProfile(userAddress, { isVerified: true })
      loadDashboardData()
    } catch (error) {
      console.error('Error verifying user:', error)
    }
  }

  const handleRevokeUser = async (userAddress: string) => {
    try {
      // In real implementation, this would call the API to revoke user verification
      await apiService.updateUserProfile(userAddress, { isVerified: false })
      loadDashboardData()
    } catch (error) {
      console.error('Error revoking user:', error)
    }
  }

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.proposer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredUsers = users.filter(user => {
    return user.address.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'active':
        return <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      case 'executed':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'passed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'executed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ResponsiveContainer maxWidth="full" padding="lg">
      <div className="space-y-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <ResponsiveText 
            size={{ default: '2xl', sm: '3xl', md: '4xl' }}
            weight="bold"
            className="mb-4"
          >
            Admin Dashboard
          </ResponsiveText>
          <ResponsiveText 
            size={{ default: 'base', sm: 'lg' }}
            color="muted"
          >
            Manage city governance and oversee DAO operations
          </ResponsiveText>
        </motion.div>

        {/* Stats Grid */}
        <ResponsiveGrid cols={{ default: 2, sm: 4 }} gap="md">
          {[
            {
              title: 'Total Proposals',
              value: stats?.totalProposals.toString() || '0',
              change: '+12%',
              changeType: 'positive' as const,
              icon: FileText,
              color: 'text-blue-600 dark:text-blue-400',
              bgColor: 'bg-blue-50 dark:bg-blue-900/20'
            },
            {
              title: 'Active Proposals',
              value: stats?.activeProposals.toString() || '0',
              change: '+2',
              changeType: 'neutral' as const,
              icon: Clock,
              color: 'text-yellow-600 dark:text-yellow-400',
              bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
            },
            {
              title: 'Treasury Balance',
              value: stats?.treasuryBalance || '$0',
              change: '+15%',
              changeType: 'positive' as const,
              icon: DollarSign,
              color: 'text-green-600 dark:text-green-400',
              bgColor: 'bg-green-50 dark:bg-green-900/20'
            },
            {
              title: 'Verified Citizens',
              value: `${stats?.verifiedUsers || 0}/${stats?.totalUsers || 0}`,
              change: '+8%',
              changeType: 'positive' as const,
              icon: Users,
              color: 'text-purple-600 dark:text-purple-400',
              bgColor: 'bg-purple-50 dark:bg-purple-900/20'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
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
                        {stat.title}
                      </ResponsiveText>
                      <ResponsiveText 
                        size={{ default: '2xl', sm: '3xl' }}
                        weight="bold"
                        className="mb-2"
                      >
                        {stat.value}
                      </ResponsiveText>
                      <ResponsiveText 
                        size={{ default: 'xs' }}
                        color={stat.changeType === 'positive' ? 'primary' : stat.changeType === 'neutral' ? 'muted' : 'muted'}
                      >
                        {stat.change} vs last month
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

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'proposals', label: 'Proposals', icon: FileText },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'treasury', label: 'Treasury', icon: DollarSign }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-neutral-100 shadow-sm'
                  : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <EnhancedCard variant="glass">
              <EnhancedCardHeader>
                <EnhancedCardTitle>Quick Actions</EnhancedCardTitle>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <ResponsiveGrid cols={{ default: 2, sm: 4 }} gap="md">
                  <EnhancedButton 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setSelectedTab('proposals')}
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    <span>Review Proposals</span>
                  </EnhancedButton>
                  <EnhancedButton 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setSelectedTab('users')}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    <span>Manage Users</span>
                  </EnhancedButton>
                  <EnhancedButton 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setSelectedTab('treasury')}
                  >
                    <DollarSign className="h-6 w-6 mb-2" />
                    <span>Treasury</span>
                  </EnhancedButton>
                  <EnhancedButton variant="outline" className="h-20 flex-col">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span>Analytics</span>
                  </EnhancedButton>
                </ResponsiveGrid>
              </EnhancedCardContent>
            </EnhancedCard>

            {/* Recent Activity */}
            <EnhancedCard variant="glass">
              <EnhancedCardHeader>
                <EnhancedCardTitle>Recent Activity</EnhancedCardTitle>
              </EnhancedCardHeader>
              <EnhancedCardContent className="space-y-4">
                {[
                  { action: 'Proposal approved', details: 'Community Garden Initiative', time: '2 hours ago', icon: CheckCircle },
                  { action: 'New proposal submitted', details: 'Street Lighting Upgrade', time: '4 hours ago', icon: FileText },
                  { action: 'User verification completed', details: '15 new citizens verified', time: '6 hours ago', icon: Users },
                  { action: 'Treasury transfer executed', details: '$25,000 to Infrastructure Fund', time: '1 day ago', icon: DollarSign }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <activity.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    <div className="flex-1">
                      <ResponsiveText 
                        size={{ default: 'sm', sm: 'base' }}
                        weight="medium"
                      >
                        {activity.action}
                      </ResponsiveText>
                      <ResponsiveText 
                        size={{ default: 'xs', sm: 'sm' }}
                        color="muted"
                      >
                        {activity.details}
                      </ResponsiveText>
                    </div>
                    <ResponsiveText 
                      size={{ default: 'xs' }}
                      color="muted"
                    >
                      {activity.time}
                    </ResponsiveText>
                  </motion.div>
                ))}
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        )}

        {selectedTab === 'proposals' && (
          <div className="space-y-6">
            {/* Filters */}
            <EnhancedCard variant="glass">
              <EnhancedCardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
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
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                    <option value="executed">Executed</option>
                  </select>
                  <EnhancedButton variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </EnhancedButton>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            {/* Proposals Table */}
            <EnhancedCard variant="glass">
              <EnhancedCardHeader>
                <EnhancedCardTitle>Proposals ({filteredProposals.length})</EnhancedCardTitle>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-neutral-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Proposal</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Proposer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Budget</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Votes</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProposals.map((proposal, index) => (
                        <motion.tr
                          key={proposal.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <ResponsiveText 
                                size={{ default: 'sm', sm: 'base' }}
                                weight="medium"
                                className="mb-1"
                              >
                                {proposal.title}
                              </ResponsiveText>
                              <ResponsiveText 
                                size={{ default: 'xs', sm: 'sm' }}
                                color="muted"
                              >
                                {proposal.category} • {proposal.createdAt}
                              </ResponsiveText>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <ResponsiveText 
                              size={{ default: 'xs', sm: 'sm' }}
                              className="font-mono"
                            >
                              {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                            </ResponsiveText>
                          </td>
                          <td className="py-4 px-4">
                            <ResponsiveText 
                              size={{ default: 'sm', sm: 'base' }}
                              weight="medium"
                            >
                              ${proposal.budget.toLocaleString()}
                            </ResponsiveText>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                              {getStatusIcon(proposal.status)}
                              <span className="ml-1">{proposal.status}</span>
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <div className="mb-1">{proposal.votes}/{proposal.totalVotes}</div>
                              <EnhancedProgress
                                value={proposal.votes}
                                max={proposal.totalVotes}
                                size="sm"
                                variant="default"
                                className="w-16"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <EnhancedButton variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </EnhancedButton>
                              {proposal.status === 'pending' && (
                                <>
                                  <EnhancedButton 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleApproveProposal(proposal.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </EnhancedButton>
                                  <EnhancedButton 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRejectProposal(proposal.id)}
                                  >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </EnhancedButton>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        )}

        {selectedTab === 'users' && (
          <div className="space-y-6">
            {/* User Filters */}
            <EnhancedCard variant="glass">
              <EnhancedCardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users by address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <EnhancedButton variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Users
                  </EnhancedButton>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            {/* Users Table */}
            <EnhancedCard variant="glass">
              <EnhancedCardHeader>
                <EnhancedCardTitle>Users ({filteredUsers.length})</EnhancedCardTitle>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-neutral-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Address</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Voting Power</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Proposals</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Joined</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-neutral-100">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.address}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <ResponsiveText 
                              size={{ default: 'xs', sm: 'sm' }}
                              className="font-mono"
                            >
                              {user.address.slice(0, 6)}...{user.address.slice(-4)}
                            </ResponsiveText>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.isVerified 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {user.isVerified ? (
                                <>
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Verified
                                </>
                              ) : (
                                <>
                                  <UserX className="h-3 w-3 mr-1" />
                                  Pending
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <ResponsiveText 
                              size={{ default: 'sm', sm: 'base' }}
                              weight="medium"
                            >
                              {user.votingPower.toLocaleString()}
                            </ResponsiveText>
                          </td>
                          <td className="py-4 px-4">
                            <ResponsiveText 
                              size={{ default: 'sm', sm: 'base' }}
                            >
                              {user.proposalsCount}
                            </ResponsiveText>
                          </td>
                          <td className="py-4 px-4">
                            <ResponsiveText 
                              size={{ default: 'xs', sm: 'sm' }}
                              color="muted"
                            >
                              {new Date(user.joinedAt).toLocaleDateString()}
                            </ResponsiveText>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {user.isVerified ? (
                                <EnhancedButton 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRevokeUser(user.address)}
                                >
                                  <UserX className="h-4 w-4 text-red-600" />
                                </EnhancedButton>
                              ) : (
                                <EnhancedButton 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleVerifyUser(user.address)}
                                >
                                  <UserCheck className="h-4 w-4 text-green-600" />
                                </EnhancedButton>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        )}

        {selectedTab === 'treasury' && (
          <div className="space-y-6">
            <EnhancedCard variant="glass">
              <EnhancedCardHeader>
                <EnhancedCardTitle>Treasury Management</EnhancedCardTitle>
              </EnhancedCardHeader>
              <EnhancedCardContent className="space-y-6">
                {/* Treasury Stats */}
                <ResponsiveGrid cols={{ default: 1, sm: 3 }} gap="md">
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <ResponsiveText 
                      size={{ default: 'lg', sm: 'xl' }}
                      weight="bold"
                      className="mb-1"
                    >
                      {stats?.treasuryBalance || '$0'}
                    </ResponsiveText>
                    <ResponsiveText 
                      size={{ default: 'sm' }}
                      color="muted"
                    >
                      Total Balance
                    </ResponsiveText>
                  </div>
                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <ResponsiveText 
                      size={{ default: 'lg', sm: 'xl' }}
                      weight="bold"
                      className="mb-1"
                    >
                      +15%
                    </ResponsiveText>
                    <ResponsiveText 
                      size={{ default: 'sm' }}
                      color="muted"
                    >
                      Monthly Growth
                    </ResponsiveText>
                  </div>
                  <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <PieChart className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <ResponsiveText 
                      size={{ default: 'lg', sm: 'xl' }}
                      weight="bold"
                      className="mb-1"
                    >
                      12
                    </ResponsiveText>
                    <ResponsiveText 
                      size={{ default: 'sm' }}
                      color="muted"
                    >
                      Active Allocations
                    </ResponsiveText>
                  </div>
                </ResponsiveGrid>

                {/* Treasury Actions */}
                <div className="space-y-4">
                  <ResponsiveText 
                    size={{ default: 'lg', sm: 'xl' }}
                    weight="semibold"
                  >
                    Treasury Actions
                  </ResponsiveText>
                  <ResponsiveGrid cols={{ default: 1, sm: 2 }} gap="md">
                    <EnhancedButton variant="outline" className="h-20 flex-col">
                      <DollarSign className="h-6 w-6 mb-2" />
                      <span>Deposit Funds</span>
                    </EnhancedButton>
                    <EnhancedButton variant="outline" className="h-20 flex-col">
                      <ArrowUpRight className="h-6 w-6 mb-2" />
                      <span>Withdraw Funds</span>
                    </EnhancedButton>
                    <EnhancedButton variant="outline" className="h-20 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      <span>Execute Proposal</span>
                    </EnhancedButton>
                    <EnhancedButton variant="outline" className="h-20 flex-col">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      <span>View Analytics</span>
                    </EnhancedButton>
                  </ResponsiveGrid>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        )}
      </div>
    </ResponsiveContainer>
  )
}
