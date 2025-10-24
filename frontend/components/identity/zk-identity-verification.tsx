'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  EyeOff,
  Upload,
  Download,
  RefreshCw,
  Info
} from 'lucide-react'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EnhancedProgress } from '@/components/ui/enhanced-progress'
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText } from '@/components/ui/responsive-container'
import { apiService } from '@/lib/api-service'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

interface ZKProof {
  id: string
  identityHash: string
  proof: string
  metadata: string
  timestamp: number
  status: 'pending' | 'verified' | 'rejected'
}

interface IdentityStatus {
  isVerified: boolean
  verificationTimestamp?: number
  proofCount: number
  identityHash?: string
  metadata?: string
}

export function ZKIdentityVerification() {
  const { address, isConnected } = useAccount()
  const [identityStatus, setIdentityStatus] = useState<IdentityStatus | null>(null)
  const [proofs, setProofs] = useState<ZKProof[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showProof, setShowProof] = useState(false)
  const [proofData, setProofData] = useState({
    identityHash: '',
    proof: '',
    metadata: ''
  })

  useEffect(() => {
    loadIdentityStatus()
  }, [isConnected, address])

  const loadIdentityStatus = async () => {
    try {
      setLoading(true)
      // Mock implementation - in real app, this would call the API
      setIdentityStatus({
        isVerified: false,
        proofCount: 0
      })
      setProofs([])
    } catch (error) {
      console.error('Error loading identity status:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitZKProof = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      setSubmitting(true)
      
      // Generate mock proof data
      const mockProof = {
        id: Date.now().toString(),
        identityHash: proofData.identityHash || `0x${Math.random().toString(16).substr(2, 8)}`,
        proof: proofData.proof || `proof_${Math.random().toString(16).substr(2, 8)}`,
        metadata: proofData.metadata || 'Mock ZK proof metadata',
        timestamp: Date.now(),
        status: 'pending' as const
      }

      // Submit ZK proof using the connected wallet address
      await apiService.submitZKProof(address, mockProof.identityHash, mockProof.proof, mockProof.metadata)
      
      setProofs(prev => [mockProof, ...prev])
      setIdentityStatus(prev => prev ? { ...prev, proofCount: prev.proofCount + 1 } : null)
      
      toast.success('ZK Proof submitted successfully!')
      
      // Reset form
      setProofData({
        identityHash: '',
        proof: '',
        metadata: ''
      })
      
    } catch (error) {
      console.error('Error submitting ZK proof:', error)
      toast.error('Failed to submit ZK proof. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const generateMockProof = () => {
    setProofData({
      identityHash: `0x${Math.random().toString(16).substr(2, 8)}${Math.random().toString(16).substr(2, 8)}`,
      proof: `proof_${Math.random().toString(16).substr(2, 8)}${Math.random().toString(16).substr(2, 8)}`,
      metadata: JSON.stringify({
        name: 'John Doe',
        age: '25',
        location: 'New York',
        verified: true
      })
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-purple-600 dark:text-purple-400" />
          </div>
          <ResponsiveText 
            size={{ default: '2xl', sm: '3xl', md: '4xl' }}
            weight="bold"
            className="mb-4"
          >
            ZK Identity Verification
          </ResponsiveText>
          <ResponsiveText 
            size={{ default: 'base', sm: 'lg' }}
            color="muted"
          >
            Verify your identity privately using zero-knowledge proofs
          </ResponsiveText>
        </motion.div>

        {/* Identity Status */}
        <EnhancedCard variant="glass">
          <EnhancedCardHeader>
            <EnhancedCardTitle>Identity Status</EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <ResponsiveGrid cols={{ default: 1, sm: 3 }} gap="md">
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <ResponsiveText 
                  size={{ default: 'lg', sm: 'xl' }}
                  weight="bold"
                  className="mb-1"
                >
                  {identityStatus?.isVerified ? 'Verified' : 'Not Verified'}
                </ResponsiveText>
                <ResponsiveText 
                  size={{ default: 'sm' }}
                  color="muted"
                >
                  Identity Status
                </ResponsiveText>
              </div>
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <ResponsiveText 
                  size={{ default: 'lg', sm: 'xl' }}
                  weight="bold"
                  className="mb-1"
                >
                  {identityStatus?.proofCount || 0}
                </ResponsiveText>
                <ResponsiveText 
                  size={{ default: 'sm' }}
                  color="muted"
                >
                  Proofs Submitted
                </ResponsiveText>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <ResponsiveText 
                  size={{ default: 'lg', sm: 'xl' }}
                  weight="bold"
                  className="mb-1"
                >
                  {identityStatus?.verificationTimestamp ? 
                    new Date(identityStatus.verificationTimestamp).toLocaleDateString() : 
                    'Not Verified'
                  }
                </ResponsiveText>
                <ResponsiveText 
                  size={{ default: 'sm' }}
                  color="muted"
                >
                  Verification Date
                </ResponsiveText>
              </div>
            </ResponsiveGrid>
          </EnhancedCardContent>
        </EnhancedCard>

        {/* Submit Proof Form */}
        <EnhancedCard variant="glass">
          <EnhancedCardHeader>
            <EnhancedCardTitle>Submit ZK Proof</EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <ResponsiveText 
                    size={{ default: 'sm', sm: 'base' }}
                    weight="medium"
                    className="mb-1"
                  >
                    How ZK Identity Verification Works
                  </ResponsiveText>
                  <ResponsiveText 
                    size={{ default: 'xs', sm: 'sm' }}
                    color="muted"
                  >
                    Submit a zero-knowledge proof that verifies your identity without revealing personal information. 
                    The proof demonstrates you are a unique person without exposing your actual identity.
                  </ResponsiveText>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Identity Hash
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={proofData.identityHash}
                  onChange={(e) => setProofData(prev => ({ ...prev, identityHash: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  ZK Proof
                </label>
                <div className="relative">
                  <input
                    type={showProof ? 'text' : 'password'}
                    placeholder="Enter your ZK proof..."
                    value={proofData.proof}
                    onChange={(e) => setProofData(prev => ({ ...prev, proof: e.target.value }))}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowProof(!showProof)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300"
                  >
                    {showProof ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Metadata (JSON)
                </label>
                <textarea
                  placeholder='{"name": "John Doe", "age": "25", "location": "New York"}'
                  value={proofData.metadata}
                  onChange={(e) => setProofData(prev => ({ ...prev, metadata: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <EnhancedButton 
                variant="gradient" 
                size="lg"
                onClick={submitZKProof}
                disabled={submitting || !proofData.identityHash || !proofData.proof}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Proof
                  </>
                )}
              </EnhancedButton>
              <EnhancedButton 
                variant="outline" 
                size="lg"
                onClick={generateMockProof}
                disabled={submitting}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Mock
              </EnhancedButton>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>

        {/* Proof History */}
        {proofs.length > 0 && (
          <EnhancedCard variant="glass">
            <EnhancedCardHeader>
              <EnhancedCardTitle>Proof History</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="space-y-4">
                {proofs.map((proof, index) => (
                  <motion.div
                    key={proof.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(proof.status)}
                      <div>
                        <ResponsiveText 
                          size={{ default: 'sm', sm: 'base' }}
                          weight="medium"
                          className="mb-1"
                        >
                          Proof #{proof.id}
                        </ResponsiveText>
                        <ResponsiveText 
                          size={{ default: 'xs', sm: 'sm' }}
                          color="muted"
                          className="font-mono"
                        >
                          {proof.identityHash.slice(0, 10)}...{proof.identityHash.slice(-6)}
                        </ResponsiveText>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proof.status)}`}>
                        {proof.status}
                      </span>
                      <ResponsiveText 
                        size={{ default: 'xs' }}
                        color="muted"
                      >
                        {new Date(proof.timestamp).toLocaleDateString()}
                      </ResponsiveText>
                      <EnhancedButton variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </EnhancedButton>
                    </div>
                  </motion.div>
                ))}
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        )}

        {/* Verification Progress */}
        {identityStatus && identityStatus.proofCount > 0 && !identityStatus.isVerified && (
          <EnhancedCard variant="glass">
            <EnhancedCardHeader>
              <EnhancedCardTitle>Verification Progress</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <ResponsiveText 
                    size={{ default: 'sm', sm: 'base' }}
                    weight="medium"
                  >
                    Proofs Submitted: {identityStatus.proofCount}/3
                  </ResponsiveText>
                  <ResponsiveText 
                    size={{ default: 'sm', sm: 'base' }}
                    weight="medium"
                  >
                    {Math.min((identityStatus.proofCount / 3) * 100, 100).toFixed(0)}%
                  </ResponsiveText>
                </div>
                <EnhancedProgress
                  value={identityStatus.proofCount}
                  max={3}
                  size="lg"
                  variant="default"
                />
                <ResponsiveText 
                  size={{ default: 'xs', sm: 'sm' }}
                  color="muted"
                >
                  Submit 3 proofs to complete verification. Each proof strengthens your identity verification.
                </ResponsiveText>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        )}
      </div>
    </ResponsiveContainer>
  )
}
