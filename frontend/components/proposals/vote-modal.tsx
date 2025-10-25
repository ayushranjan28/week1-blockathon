'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Vote, 
  CheckCircle, 
  XCircle, 
  Minus, 
  TrendingUp, 
  Users, 
  Clock,
  AlertCircle,
  Loader2,
  BarChart3,
  X,
  Tag,
  DollarSign
} from 'lucide-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { EnhancedProgress } from '@/components/ui/enhanced-progress'
import { ResponsiveContainer, ResponsiveText } from '@/components/ui/responsive-container'
import { apiService } from '@/lib/api-service'
import { smartContractService, VoteSupport, formatVoteSupport } from '@/lib/smart-contract-service'
import { useAccount, useWalletClient } from 'wagmi'
import toast from 'react-hot-toast'

interface VoteModalProps {
  proposal: {
    id: string
    title: string
    description: string
    status: string
    votesFor: number
    votesAgainst: number
    votesAbstain: number
    totalVotes: number
    deadline: string
    category: string
    budget: string
  }
  userVotingPower: number
  hasVoted: boolean
  userVote?: number
  onVoteSubmitted: () => void
  onClose: () => void
}

const voteOptions = [
  {
    value: 1,
    label: 'For',
    description: 'I support this proposal',
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  {
    value: 0,
    label: 'Against',
    description: 'I oppose this proposal',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  {
    value: 2,
    label: 'Abstain',
    description: 'I have no strong opinion',
    icon: Minus,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-800'
  }
]

export function VoteModal({ 
  proposal, 
  userVotingPower, 
  hasVoted, 
  userVote, 
  onVoteSubmitted, 
  onClose 
}: VoteModalProps) {
  const [selectedVote, setSelectedVote] = useState<number | null>(userVote ?? null)
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voteStats, setVoteStats] = useState({
    for: proposal.votesFor,
    against: proposal.votesAgainst,
    abstain: proposal.votesAbstain,
    total: proposal.totalVotes
  })

  const canVote = proposal.status === 'active' && !hasVoted && userVotingPower > 0
  const totalVotingPower = Math.max(voteStats.total, 1000) // Assume minimum 1000 total voting power

  const handleVote = async () => {
    if (!selectedVote && selectedVote !== 0) {
      toast.error('Please select a vote option')
      return
    }

    if (!address || !walletClient) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsSubmitting(true)

    try {
      // Check if user's identity is verified
      const isVerified = await smartContractService.isIdentityVerified(address)
      if (!isVerified) {
        toast.error('Please verify your identity before voting')
        setIsSubmitting(false)
        return
      }

      // Convert vote value to VoteSupport enum
      let voteSupport: VoteSupport
      switch (selectedVote) {
        case 1:
          voteSupport = VoteSupport.For
          break
        case 0:
          voteSupport = VoteSupport.Against
          break
        case 2:
          voteSupport = VoteSupport.Abstain
          break
        default:
          throw new Error('Invalid vote selection')
      }

      // Submit vote to smart contract
      const result = await smartContractService.castVote(
        proposal.id,
        voteSupport,
        reason || 'No reason provided',
        address,
        walletClient
      )

      if (result.success) {
        toast.success('Vote submitted to blockchain successfully!')
        
        // Wait for transaction confirmation
        if (result.hash) {
          toast.loading('Waiting for transaction confirmation...', { id: 'vote-tx' })
          await smartContractService.waitForTransaction(result.hash)
          toast.success('Transaction confirmed!', { id: 'vote-tx' })
        }

        // Update local stats
        const newStats = { ...voteStats }
        if (selectedVote === 1) {
          newStats.for += userVotingPower
        } else if (selectedVote === 0) {
          newStats.against += userVotingPower
        } else if (selectedVote === 2) {
          newStats.abstain += userVotingPower
        }
        newStats.total += userVotingPower
        setVoteStats(newStats)

        onVoteSubmitted()
        onClose()
      } else {
        throw new Error('Failed to submit vote to contract')
      }
    } catch (error) {
      console.error('Vote submission failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit vote'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getVotePercentage = (votes: number) => {
    return totalVotingPower > 0 ? (votes / totalVotingPower) * 100 : 0
  }

  const getVoteProgress = (votes: number) => {
    return Math.min((votes / totalVotingPower) * 100, 100)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <EnhancedCard variant="glass" className="border-0 shadow-2xl">
          <EnhancedCardHeader className="border-b border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <EnhancedCardTitle className="flex items-center">
                <Vote className="h-5 w-5 mr-2" />
                Cast Your Vote
              </EnhancedCardTitle>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </EnhancedCardHeader>

          <EnhancedCardContent className="space-y-6">
            {/* Proposal Info */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
              <ResponsiveText 
                size={{ default: 'lg', sm: 'xl' }}
                weight="semibold"
                className="mb-2"
              >
                {proposal.title}
              </ResponsiveText>
              <ResponsiveText 
                size={{ default: 'sm' }}
                color="muted"
                className="mb-3"
              >
                {proposal.description.substring(0, 200)}...
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
                  <Clock className="h-4 w-4 mr-1" />
                  {proposal.deadline}
                </span>
              </div>
            </div>

            {/* Voting Power */}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <ResponsiveText 
                    size={{ default: 'sm' }}
                    weight="medium"
                    className="text-primary-700 dark:text-primary-300"
                  >
                    Your Voting Power
                  </ResponsiveText>
                  <ResponsiveText 
                    size={{ default: 'lg', sm: 'xl' }}
                    weight="bold"
                    className="text-primary-800 dark:text-primary-200"
                  >
                    {userVotingPower.toLocaleString()} votes
                  </ResponsiveText>
                </div>
                <TrendingUp className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>

            {/* Current Vote Stats */}
            <div>
              <ResponsiveText 
                size={{ default: 'base', sm: 'lg' }}
                weight="semibold"
                className="mb-4 flex items-center"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Current Results
              </ResponsiveText>
              
              <div className="space-y-3">
                {voteOptions.map((option) => {
                  const votes = option.value === 1 ? voteStats.for : 
                               option.value === 0 ? voteStats.against : voteStats.abstain
                  const percentage = getVotePercentage(votes)
                  const progress = getVoteProgress(votes)
                  
                  return (
                    <div key={option.value} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <option.icon className={`h-4 w-4 ${option.color}`} />
                          <ResponsiveText 
                            size={{ default: 'sm' }}
                            weight="medium"
                          >
                            {option.label}
                          </ResponsiveText>
                        </div>
                        <div className="text-right">
                          <ResponsiveText 
                            size={{ default: 'sm' }}
                            weight="medium"
                          >
                            {votes.toLocaleString()} votes
                          </ResponsiveText>
                          <ResponsiveText 
                            size={{ default: 'xs' }}
                            color="muted"
                          >
                            {percentage.toFixed(1)}%
                          </ResponsiveText>
                        </div>
                      </div>
                      <EnhancedProgress
                        value={progress}
                        max={100}
                        size="sm"
                        variant="default"
                        className="h-2"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Vote Options */}
            {canVote && (
              <div>
                <ResponsiveText 
                  size={{ default: 'base', sm: 'lg' }}
                  weight="semibold"
                  className="mb-4"
                >
                  How do you want to vote?
                </ResponsiveText>
                
                <div className="space-y-3">
                  {voteOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedVote(option.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedVote === option.value
                          ? `${option.borderColor} ${option.bgColor}`
                          : 'border-gray-200 dark:border-neutral-700 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <option.icon className={`h-6 w-6 ${option.color}`} />
                        <div>
                          <ResponsiveText 
                            size={{ default: 'base', sm: 'lg' }}
                            weight="semibold"
                            className="mb-1"
                          >
                            {option.label}
                          </ResponsiveText>
                          <ResponsiveText 
                            size={{ default: 'sm' }}
                            color="muted"
                          >
                            {option.description}
                          </ResponsiveText>
                        </div>
                        {selectedVote === option.value && (
                          <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reason (Optional) */}
            {canVote && selectedVote !== null && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain your vote (optional)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            )}

            {/* Status Messages */}
            {!canVote && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <ResponsiveText 
                    size={{ default: 'sm' }}
                    weight="medium"
                    className="text-yellow-800 dark:text-yellow-200"
                  >
                    {hasVoted 
                      ? 'You have already voted on this proposal'
                      : proposal.status !== 'active'
                      ? 'This proposal is no longer accepting votes'
                      : 'You need voting power to participate'
                    }
                  </ResponsiveText>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <EnhancedButton
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </EnhancedButton>
              {canVote && (
                <EnhancedButton
                  variant="default"
                  onClick={handleVote}
                  disabled={isSubmitting || selectedVote === null}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Voting...
                    </>
                  ) : (
                    <>
                      <Vote className="h-4 w-4 mr-2" />
                      Submit Vote
                    </>
                  )}
                </EnhancedButton>
              )}
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      </motion.div>
    </div>
  )
}