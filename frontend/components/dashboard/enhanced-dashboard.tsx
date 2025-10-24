'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Vote, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EnhancedProgress } from '@/components/ui/enhanced-progress'
import { CircularProgress } from '@/components/ui/enhanced-progress'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const stats = [
  {
    title: 'Total Proposals',
    value: '24',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Vote,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    title: 'Active Voters',
    value: '1,247',
    change: '+8%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    title: 'Treasury Value',
    value: '$2.4M',
    change: '+15%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    title: 'Participation Rate',
    value: '68%',
    change: '+5%',
    changeType: 'positive' as const,
    icon: Activity,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  }
]

const recentProposals = [
  {
    id: 1,
    title: 'Community Garden Initiative',
    status: 'active',
    votes: 156,
    totalVotes: 200,
    deadline: '3 days left',
    category: 'Environment'
  },
  {
    id: 2,
    title: 'Public WiFi Expansion',
    status: 'passed',
    votes: 89,
    totalVotes: 120,
    deadline: 'Completed',
    category: 'Infrastructure'
  },
  {
    id: 3,
    title: 'Youth Sports Program',
    status: 'pending',
    votes: 45,
    totalVotes: 150,
    deadline: '7 days left',
    category: 'Education'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    case 'passed':
      return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    default:
      return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'passed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

export function EnhancedDashboard() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
            Civic DAO Dashboard
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-2">
            Monitor governance activity and community engagement
          </p>
        </div>
        <div className="flex gap-3">
          <EnhancedButton variant="outline" size="sm">
            Export Data
          </EnhancedButton>
          <EnhancedButton variant="gradient" size="sm" animation="glow">
            Create Proposal
          </EnhancedButton>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                    <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-neutral-500 ml-1">
                    vs last month
                  </span>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Proposals */}
        <div className="lg:col-span-2">
          <EnhancedCard variant="glass">
            <EnhancedCardHeader>
              <EnhancedCardTitle>Recent Proposals</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent className="space-y-4">
              {recentProposals.map((proposal, index) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(proposal.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-neutral-100">
                        {proposal.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {proposal.category} • {proposal.deadline}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                        {proposal.votes}/{proposal.totalVotes} votes
                      </div>
                      <EnhancedProgress
                        value={proposal.votes}
                        max={proposal.totalVotes}
                        size="sm"
                        variant="default"
                        className="w-20"
                      />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </EnhancedCardContent>
          </EnhancedCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participation Rate */}
          <EnhancedCard variant="gradient">
            <EnhancedCardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">
                Community Participation
              </h3>
              <CircularProgress
                value={68}
                size={120}
                variant="success"
                showValue={true}
                animated={true}
                className="mx-auto mb-4"
              />
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Above average participation this month
              </p>
            </EnhancedCardContent>
          </EnhancedCard>

          {/* Quick Actions */}
          <EnhancedCard>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Quick Actions</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent className="space-y-3">
              <EnhancedButton variant="outline" className="w-full justify-start" animation="scale">
                <Vote className="mr-2 h-4 w-4" />
                Vote on Proposals
              </EnhancedButton>
              <EnhancedButton variant="outline" className="w-full justify-start" animation="scale">
                <Activity className="mr-2 h-4 w-4" />
                View Analytics
              </EnhancedButton>
              <EnhancedButton variant="accent" className="w-full" animation="glow">
                Create New Proposal
              </EnhancedButton>
            </EnhancedCardContent>
          </EnhancedCard>

          {/* Loading Example */}
          <EnhancedCard>
            <EnhancedCardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">
                Loading States
              </h3>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <LoadingSpinner size="md" variant="default" />
                </div>
                <div className="flex justify-center space-x-2">
                  <LoadingSpinner size="sm" variant="dots" />
                </div>
                <div className="flex justify-center">
                  <LoadingSpinner size="lg" variant="bounce" />
                </div>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      </div>
    </div>
  )
}
