'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Reply,
  MoreVertical,
  Flag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Vote } from '@/types'
import { formatAddress, formatRelativeTime } from '@/lib/utils'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

interface CommentSectionProps {
  proposalId: string
  votes: Vote[]
}

export function CommentSection({ proposalId, votes }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const { address, isConnected } = useAccount()

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    if (!isConnected) {
      toast.error('Please connect your wallet to comment')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate comment submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Comment added successfully')
      setNewComment('')
      setReplyingTo(null)
    } catch (error) {
      toast.error('Failed to add comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = (commentId: string) => {
    if (!isConnected) {
      toast.error('Please connect your wallet to like comments')
      return
    }
    toast.success('Comment liked!')
  }

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId)
  }

  const getVoteColor = (support: string) => {
    switch (support) {
      case 'for':
        return 'text-green-600 bg-green-100'
      case 'against':
        return 'text-red-600 bg-red-100'
      case 'abstain':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getVoteIcon = (support: string) => {
    switch (support) {
      case 'for':
        return '👍'
      case 'against':
        return '👎'
      case 'abstain':
        return '🤷'
      default:
        return '💭'
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Add a Comment</h3>
        </div>
        
        <div className="space-y-3">
          <Textarea
            placeholder="Share your thoughts on this proposal..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
            disabled={!isConnected}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {isConnected ? 'Your comment will be public' : 'Connect wallet to comment'}
            </div>
            <Button
              onClick={handleSubmitComment}
              disabled={!isConnected || !newComment.trim() || isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">
            Comments ({votes.length})
          </h3>
          <div className="text-sm text-gray-500">
            Sorted by most recent
          </div>
        </div>

        {votes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {votes.map((vote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {vote.voter.slice(2, 4).toUpperCase()}
                        </span>
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {formatAddress(vote.voter)}
                          </span>
                          <Badge className={getVoteColor(vote.support)}>
                            {getVoteIcon(vote.support)} {vote.support}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatRelativeTime(Date.now() - Math.random() * 86400000 * 7)}
                          </span>
                        </div>

                        {vote.reason && (
                          <p className="text-gray-700 mb-3">{vote.reason}</p>
                        )}

                        {/* Comment Actions */}
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(`comment-${index}`)}
                            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                            disabled={!isConnected}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>Like</span>
                          </button>
                          <button
                            onClick={() => handleReply(`comment-${index}`)}
                            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                            disabled={!isConnected}
                          >
                            <Reply className="h-4 w-4" />
                            <span>Reply</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                            <Flag className="h-4 w-4" />
                            <span>Report</span>
                          </button>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === `comment-${index}` && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-3"
                          >
                            <Textarea
                              placeholder="Write a reply..."
                              className="min-h-[60px]"
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" className="btn-primary">
                                Reply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setReplyingTo(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* More Options */}
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
