'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Vote, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// Mock data - replace with real data from your API
const mockStats = {
  totalProposals: 12,
  activeProposals: 3,
  executedProposals: 5,
  defeatedProposals: 2,
  totalVotes: 8750,
  totalParticipants: 1240,
  totalBudget: 1250000,
  participationRate: 78.5,
  recentActivity: [
    { type: 'proposal', title: 'New Bike Lane Infrastructure', time: '2 hours ago' },
    { type: 'vote', title: 'Community Garden Initiative', time: '4 hours ago' },
    { type: 'proposal', title: 'Digital Library Access', time: '1 day ago' },
    { type: 'vote', title: 'Park Renovation Project', time: '2 days ago' },
  ]
}

const statCards = [
  {
    title: 'Total Proposals',
    value: mockStats.totalProposals,
    icon: Vote,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    change: '+2 this week',
    changeType: 'positive' as const
  },
  {
    title: 'Active Proposals',
    value: mockStats.activeProposals,
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    change: '3 currently voting',
    changeType: 'neutral' as const
  },
  {
    title: 'Total Participants',
    value: mockStats.totalParticipants,
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    change: '+15% this month',
    changeType: 'positive' as const
  },
  {
    title: 'Total Budget',
    value: `$${(mockStats.totalBudget / 1000).toFixed(0)}K`,
    icon: DollarSign,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    change: '+8% this month',
    changeType: 'positive' as const
  }
]

const proposalStatusStats = [
  { status: 'Executed', count: mockStats.executedProposals, color: 'bg-green-500' },
  { status: 'Active', count: mockStats.activeProposals, color: 'bg-blue-500' },
  { status: 'Defeated', count: mockStats.defeatedProposals, color: 'bg-red-500' },
  { status: 'Pending', count: 2, color: 'bg-gray-500' }
]

export function GovernanceStats() {
  const [stats, setStats] = useState(mockStats)

  // In a real app, you would fetch this data from your API
  useEffect(() => {
    // Simulate data fetching
    const interval = setInterval(() => {
      setStats(prevStats => ({
        ...prevStats,
        totalVotes: prevStats.totalVotes + Math.floor(Math.random() * 5),
        participationRate: Math.min(100, prevStats.participationRate + Math.random() * 0.5)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' :
                stat.changeType === 'neutral' ? 'text-gray-500' :
                'text-gray-500'
              }`}>
                {stat.change}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Participation Rate Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Participation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.participationRate.toFixed(1)}%
            </div>
            <Progress value={stats.participationRate} className="h-2 mb-2" />
            <div className="text-xs text-gray-500">
              {stats.totalParticipants} active participants
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Proposal Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="md:col-span-2 lg:col-span-1"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Proposal Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposalStatusStats.map((item, index) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-2`} />
                    <span className="text-sm text-gray-600">{item.status}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="md:col-span-2 lg:col-span-2"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      activity.type === 'proposal' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <span className="text-sm text-gray-600">{activity.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}