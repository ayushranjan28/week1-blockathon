'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Clock, 
  User, 
  DollarSign, 
  Vote, 
  MessageCircle, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatAddress, formatCurrency, formatDate, formatRelativeTime, getProposalStatusColor, getCategoryColor } from '@/lib/utils'

interface Proposal {
  id: string
  title: string
  description: string
  proposer: string
  budget: string
  category: string
  status: 'active' | 'succeeded' | 'defeated' | 'executed' | 'canceled' | 'expired'
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

interface ProposalCardProps {
  proposal: Proposal
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />
      case 'succeeded':
        return <CheckCircle className="h-4 w-4" />
      case 'defeated':
        return <XCircle className="h-4 w-4" />
      case 'executed':
        return <CheckCircle className="h-4 w-4" />
      case 'canceled':
        return <XCircle className="h-4 w-4" />
      case 'expired':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getVotingProgress = () => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
    if (totalVotes === 0) return 0
    return (proposal.votesFor / totalVotes) * 100
  }

  const getVotingTrend = () => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
    if (totalVotes === 0) return 'neutral'
    const forPercentage = (proposal.votesFor / totalVotes) * 100
    if (forPercentage > 60) return 'positive'
    if (forPercentage < 40) return 'negative'
    return 'neutral'
  }

  const votingTrend = getVotingTrend()
  const votingProgress = getVotingProgress()

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`transition-all duration-200 cursor-pointer ${
          isHovered ? 'shadow-lg' : 'hover:shadow-md'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className={getCategoryColor(proposal.category)}>
                  {proposal.category}
                </Badge>
                <Badge className={getProposalStatusColor(proposal.status)}>
                  {getStatusIcon(proposal.status)}
                  <span className="ml-1 capitalize">{proposal.status}</span>
                </Badge>
                <span className="text-xs text-gray-500">
                  #{proposal.id}
                </span>
              </div>
              
              <CardTitle className="text-lg mb-2 line-clamp-2">
                {proposal.title}
              </CardTitle>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {proposal.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {votingTrend === 'positive' && (
                <TrendingUp className="h-4 w-4 text-green-500" />
              )}
              {votingTrend === 'negative' && (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Proposal Details */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span className="font-mono">{formatAddress(proposal.proposer)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="font-semibold">{formatCurrency(parseFloat(proposal.budget))}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatRelativeTime(proposal.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Hash className="h-4 w-4 mr-2" />
              <span>{proposal.totalVotes} votes</span>
            </div>
          </div>

          {/* Voting Progress */}
          {proposal.status === 'active' && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Voting Progress</span>
                <span>{votingProgress.toFixed(1)}% For</span>
              </div>
              <Progress value={votingProgress} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{proposal.votesFor} for</span>
                <span>{proposal.votesAgainst} against</span>
                <span>{proposal.votesAbstain} abstain</span>
              </div>
            </div>
          )}

          {/* Quorum Status */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Quorum</span>
              <span>{proposal.totalVotes} / {proposal.quorum}</span>
            </div>
            <Progress 
              value={(proposal.totalVotes / proposal.quorum) * 100} 
              className="h-1"
            />
            <div className="text-xs text-gray-500 mt-1">
              {proposal.totalVotes >= proposal.quorum ? 'Quorum reached' : 'Quorum not reached'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>12 comments</span>
              </div>
              <div className="flex items-center">
                <Vote className="h-4 w-4 mr-1" />
                <span>{proposal.totalVotes} votes</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              {proposal.status === 'active' && (
                <Button size="sm" className="btn-primary">
                  Vote
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}