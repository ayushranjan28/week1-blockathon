'use client'

import { useState, useEffect } from 'react'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { Proposal } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, Users, Clock, Target } from 'lucide-react'

interface ProposalChartProps {
  proposal: Proposal
}

interface VotingTrend {
  timestamp: number
  for: number
  against: number
  abstain: number
  total: number
}

interface VoterDemographics {
  votingPowerRange: string
  count: number
  percentage: number
}

const COLORS = {
  for: '#22c55e',
  against: '#ef4444',
  abstain: '#6b7280'
}

export function ProposalChart({ proposal }: ProposalChartProps) {
  const [votingTrends, setVotingTrends] = useState<VotingTrend[]>([])
  const [voterDemographics, setVoterDemographics] = useState<VoterDemographics[]>([])
  const [loading, setLoading] = useState(true)

  const data = [
    {
      name: 'For',
      value: proposal.votesFor,
      color: COLORS.for
    },
    {
      name: 'Against',
      value: proposal.votesAgainst,
      color: COLORS.against
    },
    {
      name: 'Abstain',
      value: proposal.votesAbstain,
      color: COLORS.abstain
    }
  ]

  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain

  useEffect(() => {
    // Simulate fetching voting trends and demographics
    const fetchAnalytics = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock voting trends data
      const trends: VotingTrend[] = []
      const now = Date.now()
      for (let i = 6; i >= 0; i--) {
        const timestamp = now - (i * 24 * 60 * 60 * 1000) // Last 7 days
        trends.push({
          timestamp,
          for: Math.floor(proposal.votesFor * (0.6 + Math.random() * 0.4)),
          against: Math.floor(proposal.votesAgainst * (0.6 + Math.random() * 0.4)),
          abstain: Math.floor(proposal.votesAbstain * (0.6 + Math.random() * 0.4)),
          total: Math.floor(totalVotes * (0.6 + Math.random() * 0.4))
        })
      }
      
      // Mock voter demographics
      const demographics: VoterDemographics[] = [
        { votingPowerRange: '1-100', count: 45, percentage: 35.2 },
        { votingPowerRange: '101-1000', count: 38, percentage: 29.7 },
        { votingPowerRange: '1001-5000', count: 25, percentage: 19.5 },
        { votingPowerRange: '5001-10000', count: 15, percentage: 11.7 },
        { votingPowerRange: '10000+', count: 5, percentage: 3.9 }
      ]
      
      setVotingTrends(trends)
      setVoterDemographics(demographics)
      setLoading(false)
    }

    fetchAnalytics()
  }, [proposal])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = totalVotes > 0 ? ((data.value / totalVotes) * 100).toFixed(1) : 0
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value.toLocaleString()} votes ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  const getVotePercentage = (votes: number) => {
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (totalVotes === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <p>No votes yet</p>
        <p className="text-sm">Be the first to vote on this proposal!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{proposal.votesFor.toLocaleString()}</div>
          <div className="text-sm text-gray-600">For ({getVotePercentage(proposal.votesFor)}%)</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{proposal.votesAgainst.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Against ({getVotePercentage(proposal.votesAgainst)}%)</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{proposal.votesAbstain.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Abstain ({getVotePercentage(proposal.votesAbstain)}%)</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalVotes.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Votes</div>
        </div>
      </div>

      {/* Comprehensive Charts */}
      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Voting Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Voting Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">Loading trends...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={votingTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={formatDate}
                        minTickGap={1}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => formatDate(Number(value))}
                        formatter={(value: number, name: string) => [
                          value.toLocaleString(), 
                          name.charAt(0).toUpperCase() + name.slice(1)
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="for"
                        stackId="1"
                        stroke={COLORS.for}
                        fill={COLORS.for}
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="against"
                        stackId="1"
                        stroke={COLORS.against}
                        fill={COLORS.against}
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="abstain"
                        stackId="1"
                        stroke={COLORS.abstain}
                        fill={COLORS.abstain}
                        fillOpacity={0.8}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Voter Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">Loading demographics...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={voterDemographics} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="votingPowerRange" type="category" width={100} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `${value} voters (${voterDemographics.find(d => d.count === value)?.percentage.toFixed(1)}%)`, 
                          'Count'
                        ]}
                      />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Vote Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {getVotePercentage(proposal.votesFor)}%
                  </div>
                  <div className="text-sm text-gray-600">For Rate</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getVotePercentage(proposal.votesFor)}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-red-600">
                      {getVotePercentage(proposal.votesAgainst)}%
                    </div>
                    <div className="text-sm text-gray-600">Against</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-600">
                      {getVotePercentage(proposal.votesAbstain)}%
                    </div>
                    <div className="text-sm text-gray-600">Abstain</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Quorum Progress</span>
                    <span>{totalVotes} / {proposal.quorum}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalVotes / proposal.quorum) * 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {totalVotes >= proposal.quorum ? 'Quorum reached' : 'Quorum not reached'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
