'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  User, 
  DollarSign, 
  Vote as VoteIcon, 
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Hash
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VoteModal } from '@/components/proposals/vote-modal'
import { CommentSection } from '@/components/proposals/comment-section'
import { ProposalChart } from '@/components/proposals/proposal-chart'
import { Proposal, Vote } from '@/types'
import { formatAddress, formatCurrency, formatDate, formatRelativeTime, getProposalStatusColor, getCategoryColor } from '@/lib/utils'
import { smartContractService, getProposalStateText } from '@/lib/smart-contract-service'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

// Mock data - replace with real data from your API
const mockProposal: Proposal = {
  id: '1',
  title: 'New Bike Lane Infrastructure',
  description: `This proposal aims to implement a comprehensive bike lane infrastructure project on Main Street to improve cycling safety and promote sustainable transportation within our city.

## Problem Statement
Currently, Main Street lacks dedicated cycling infrastructure, leading to:
- Safety concerns for cyclists sharing the road with motor vehicles
- Reduced cycling adoption due to safety fears
- Increased traffic congestion as cycling is not a viable alternative
- Missed opportunities for environmental benefits

## Proposed Solution
The project will include:
1. **Protected Bike Lanes**: 2.5 miles of protected bike lanes on both sides of Main Street
2. **Intersection Improvements**: Enhanced bike-friendly intersection designs
3. **Signage and Markings**: Clear directional signage and road markings
4. **Safety Barriers**: Physical separation between bike lanes and vehicle traffic
5. **Maintenance Plan**: Ongoing maintenance and monitoring program

## Budget Breakdown
- Construction: $35,000
- Materials and Equipment: $10,000
- Safety Barriers: $3,000
- Signage and Markings: $2,000
- **Total Budget**: $50,000

## Timeline
- Planning and Design: 2 months
- Construction: 3 months
- Testing and Adjustment: 1 month
- **Total Duration**: 6 months

## Expected Benefits
- 40% increase in cycling usage
- 25% reduction in cycling accidents
- Improved air quality
- Reduced traffic congestion
- Enhanced community health and wellness

## Implementation Plan
1. **Phase 1**: Design and planning (Months 1-2)
2. **Phase 2**: Construction of bike lanes (Months 3-5)
3. **Phase 3**: Installation of safety features (Month 6)
4. **Phase 4**: Testing and community feedback (Month 6)

This proposal aligns with our city's sustainability goals and will create a safer, more accessible transportation network for all residents.`,
  proposer: '0x1234567890abcdef1234567890abcdef12345678',
  budget: '50000',
  category: 'Infrastructure',
  status: 'active',
  createdAt: Date.now() - 86400000 * 2, // 2 days ago
  startBlock: 1000000,
  endBlock: 1001000,
  votesFor: 1250,
  votesAgainst: 320,
  votesAbstain: 50,
  totalVotes: 1620,
  quorum: 1000,
  executed: false,
  canceled: false,
}

const mockVotes: Vote[] = [
  {
    voter: '0x1234567890abcdef1234567890abcdef12345678',
    support: 'for',
    weight: '100',
    reason: 'This will greatly improve safety for cyclists and encourage more people to bike to work.',
    blockNumber: 1000050,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    voter: '0x9876543210fedcba9876543210fedcba98765432',
    support: 'against',
    weight: '50',
    reason: 'The budget seems too high for the proposed scope. We should look for more cost-effective alternatives.',
    blockNumber: 1000055,
    transactionHash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210'
  },
  {
    voter: '0x5555555555555555555555555555555555555555',
    support: 'abstain',
    weight: '25',
    reason: 'I need more information about the maintenance costs and long-term sustainability.',
    blockNumber: 1000060,
    transactionHash: '0x5555555555555555555555555555555555555555555555555555555555555555'
  }
]

export default function ProposalDetailPage() {
  const { id } = useParams()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [userVote, setUserVote] = useState<Vote | null>(null)
  const { address, isConnected } = useAccount()

  useEffect(() => {
    const fetchProposal = async () => {
      if (!id) return
      
      setLoading(true)
      
      try {
        // Try to fetch from smart contract first
        const contractProposal = await smartContractService.getProposal(id as string)
        
        if (contractProposal) {
          // Transform contract data to match our Proposal interface
          const transformedProposal: Proposal = {
            id: contractProposal.id,
            title: contractProposal.title,
            description: contractProposal.description,
            proposer: contractProposal.proposer,
            budget: contractProposal.budget,
            category: contractProposal.category,
            status: contractProposal.state.toLowerCase(),
            createdAt: contractProposal.createdAt,
            startBlock: contractProposal.snapshot,
            endBlock: Math.floor(contractProposal.deadline / 1000), // Convert to block (rough estimation)
            votesFor: contractProposal.votesFor,
            votesAgainst: contractProposal.votesAgainst,
            votesAbstain: contractProposal.votesAbstain,
            totalVotes: contractProposal.totalVotes,
            quorum: contractProposal.quorum,
            executed: contractProposal.state === 'executed',
            canceled: contractProposal.state === 'canceled'
          }
          
          setProposal(transformedProposal)
        } else {
          // Fallback to mock data if contract data not available
          setProposal(mockProposal)
        }
        
        // Set votes (would need to fetch from contract or API)
        setVotes(mockVotes)
        
      } catch (error) {
        console.error('Error fetching proposal:', error)
        // Fallback to mock data
        setProposal(mockProposal)
        setVotes(mockVotes)
        toast.error('Failed to load proposal data from blockchain')
      } finally {
        setLoading(false)
      }
    }

    fetchProposal()
  }, [id])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5" />
      case 'succeeded':
        return <CheckCircle className="h-5 w-5" />
      case 'defeated':
        return <XCircle className="h-5 w-5" />
      case 'executed':
        return <CheckCircle className="h-5 w-5" />
      case 'canceled':
        return <XCircle className="h-5 w-5" />
      case 'expired':
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getVotingProgress = () => {
    if (!proposal) return 0
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
    if (totalVotes === 0) return 0
    return (proposal.votesFor / totalVotes) * 100
  }

  const getVotingTrend = () => {
    if (!proposal) return 'neutral'
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
    if (totalVotes === 0) return 'neutral'
    const forPercentage = (proposal.votesFor / totalVotes) * 100
    if (forPercentage > 60) return 'positive'
    if (forPercentage < 40) return 'negative'
    return 'neutral'
  }

  const handleVote = (support: 'for' | 'against' | 'abstain', reason?: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet to vote')
      return
    }

    // In real app, submit vote to blockchain
    toast.success(`Vote submitted: ${support}`)
    setShowVoteModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposal...</p>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Proposal Not Found</h1>
          <p className="text-gray-600 mb-6">The proposal you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button className="btn-primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const votingTrend = getVotingTrend()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className={getCategoryColor(proposal.category)}>
                  {proposal.category}
                </Badge>
                <Badge className={getProposalStatusColor(proposal.status)}>
                  {getStatusIcon(proposal.status)}
                  <span className="ml-2 capitalize">{proposal.status}</span>
                </Badge>
                <span className="text-sm text-gray-500">
                  Proposal #{proposal.id}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {proposal.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="font-mono">{formatAddress(proposal.proposer)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(proposal.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span className="font-semibold">{formatCurrency(parseFloat(proposal.budget))}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proposal Description */}
            <Card>
              <CardHeader>
                <CardTitle>Proposal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {proposal.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Discussion ({votes.length} comments)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CommentSection proposalId={proposal.id} votes={votes} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <VoteIcon className="h-5 w-5 mr-2" />
                  Voting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {proposal.status === 'active' ? (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {getVotingProgress().toFixed(1)}% For
                      </div>
                      <Progress value={getVotingProgress()} className="h-3 mb-4" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{proposal.votesFor} for</span>
                        <span>{proposal.votesAgainst} against</span>
                        <span>{proposal.votesAbstain} abstain</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        className="w-full btn-primary" 
                        onClick={() => setShowVoteModal(true)}
                        disabled={!isConnected}
                      >
                        <VoteIcon className="h-4 w-4 mr-2" />
                        {isConnected ? 'Vote Now' : 'Connect Wallet to Vote'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-600">
                    <div className="text-lg font-semibold mb-2">Voting Closed</div>
                    <div className="text-sm">
                      Final Result: {getVotingProgress().toFixed(1)}% For
                    </div>
                  </div>
                )}

                {/* Quorum Status */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Quorum</span>
                    <span>{proposal.totalVotes} / {proposal.quorum}</span>
                  </div>
                  <Progress 
                    value={(proposal.totalVotes / proposal.quorum) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {proposal.totalVotes >= proposal.quorum ? 'Quorum reached' : 'Quorum not reached'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voting Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Vote Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ProposalChart proposal={proposal} />
              </CardContent>
            </Card>

            {/* Proposal Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium">Proposal Created</div>
                      <div className="text-gray-500">{formatRelativeTime(proposal.createdAt)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      proposal.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <div className="font-medium">Voting Started</div>
                      <div className="text-gray-500">
                        {proposal.status === 'active' ? 'Now' : formatRelativeTime(proposal.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      ['succeeded', 'defeated', 'executed'].includes(proposal.status) ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <div className="font-medium">Voting Ends</div>
                      <div className="text-gray-500">
                        {proposal.status === 'active' ? 'In 5 days' : 'Completed'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Vote Modal */}
      {showVoteModal && (
        <VoteModal
          proposal={proposal}
          onVote={handleVote}
          onClose={() => setShowVoteModal(false)}
        />
      )}
    </div>
  )
}
