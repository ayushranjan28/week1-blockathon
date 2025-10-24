'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Vote, 
  DollarSign, 
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { smartContractService } from '@/lib/smart-contract-service'

interface AnalyticsData {
  overview: {
    totalProposals: number
    activeProposals: number
    totalVotes: number
    participationRate: number
    totalBudget: number
    averageVotingPower: number
  }
  trends: {
    proposalsThisMonth: number
    votesThisMonth: number
    participationTrend: 'up' | 'down' | 'stable'
    budgetUtilization: number
  }
  topCategories: Array<{
    category: string
    count: number
    percentage: number
  }>
  recentActivity: Array<{
    type: 'proposal_created' | 'proposal_executed' | 'vote_cast'
    description: string
    timestamp: number
    user: string
  }>
}

// Mock data - replace with real data from your API
const mockAnalytics: AnalyticsData = {
  overview: {
    totalProposals: 47,
    activeProposals: 8,
    totalVotes: 2847,
    participationRate: 68.5,
    totalBudget: 1250000,
    averageVotingPower: 1250.5
  },
  trends: {
    proposalsThisMonth: 12,
    votesThisMonth: 456,
    participationTrend: 'up',
    budgetUtilization: 78.3
  },
  topCategories: [
    { category: 'Infrastructure', count: 15, percentage: 32 },
    { category: 'Environment', count: 12, percentage: 25 },
    { category: 'Education', count: 8, percentage: 17 },
    { category: 'Healthcare', count: 6, percentage: 13 },
    { category: 'Transportation', count: 4, percentage: 8 },
    { category: 'Other', count: 2, percentage: 5 }
  ],
  recentActivity: [
    {
      type: 'proposal_created',
      description: 'New bike lane infrastructure proposal submitted',
      timestamp: Date.now() - 3600000, // 1 hour ago
      user: '0x1234...5678'
    },
    {
      type: 'vote_cast',
      description: 'Vote cast on community garden expansion',
      timestamp: Date.now() - 7200000, // 2 hours ago
      user: '0x9876...5432'
    },
    {
      type: 'proposal_executed',
      description: 'Digital library access proposal executed',
      timestamp: Date.now() - 86400000, // 1 day ago
      user: '0x4567...8901'
    }
  ]
}

export function GovernanceAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      
      try {
        // Try to get real data from smart contract first
        const contractAddresses = await smartContractService.getContractAddresses()
        
        if (contractAddresses.civicDAO !== '0x0000000000000000000000000000000000000000') {
          // Get categories from contract
          const categories = await smartContractService.getCategories()
          
          // For now, we'll use mock data but mark that we have contract connection
          setAnalytics({
            ...mockAnalytics,
            overview: {
              ...mockAnalytics.overview,
              // We could populate real data here if we track proposal counts on-chain
            }
          })
        } else {
          // Use mock data if contracts not deployed
          setAnalytics(mockAnalytics)
        }
      } catch (error) {
        console.error('Error fetching analytics from contract:', error)
        // Fallback to mock data
        setAnalytics(mockAnalytics)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Proposals</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalProposals}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-600 font-medium">{analytics.overview.activeProposals} active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalVotes.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Vote className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-green-600 font-medium">{analytics.trends.votesThisMonth} this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Participation Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.participationRate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  {analytics.trends.participationTrend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : analytics.trends.participationTrend === 'down' ? (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <Activity className="h-4 w-4 text-gray-500 mr-1" />
                  )}
                  <span className="text-gray-600 capitalize">{analytics.trends.participationTrend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">${(analytics.overview.totalBudget / 1000000).toFixed(1)}M</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-orange-600 font-medium">{analytics.trends.budgetUtilization}% utilized</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Proposal Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCategories.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                      <span className="font-medium text-gray-900">{category.category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32">
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {category.count} ({category.percentage}%)
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      {activity.type === 'proposal_created' && <BarChart3 className="h-4 w-4 text-primary-600" />}
                      {activity.type === 'vote_cast' && <Vote className="h-4 w-4 text-primary-600" />}
                      {activity.type === 'proposal_executed' && <Target className="h-4 w-4 text-primary-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 font-mono">{activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Participation Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="font-semibold text-gray-900">{analytics.trends.votesThisMonth} votes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Proposals Created</span>
                    <span className="font-semibold text-gray-900">{analytics.trends.proposalsThisMonth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget Utilization</span>
                    <span className="font-semibold text-gray-900">{analytics.trends.budgetUtilization}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {analytics.trends.proposalsThisMonth}
                    </div>
                    <div className="text-sm text-gray-600">Proposals This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {analytics.trends.votesThisMonth}
                    </div>
                    <div className="text-sm text-gray-600">Votes Cast</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
