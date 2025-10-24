'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Wallet, 
  Settings, 
  Bell, 
  Key,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  QrCode,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAccount, useBalance } from 'wagmi'
import { formatAddress, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

interface UserProfile {
  address: string
  balance: string
  votingPower: string
  verified: boolean
  identityHash?: string
  joinedAt: number
  totalVotes: number
  proposalsCreated: number
  reputation: number
  preferences: {
    notifications: boolean
    theme: 'light' | 'dark'
    language: string
  }
}

// Mock data - replace with real data from your API
const mockProfile: UserProfile = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  balance: '1250.5',
  votingPower: '1250.5',
  verified: true,
  identityHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  joinedAt: Date.now() - 86400000 * 30, // 30 days ago
  totalVotes: 15,
  proposalsCreated: 3,
  reputation: 85,
  preferences: {
    notifications: true,
    theme: 'light',
    language: 'en'
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [zkProof, setZkProof] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })

  useEffect(() => {
    // Simulate API call
    const fetchProfile = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProfile(mockProfile)
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard')
    }
  }

  const handleVerifyZKIdentity = async () => {
    if (!zkProof.trim()) {
      toast.error('Please enter a ZK proof')
      return
    }

    setIsVerifying(true)
    
    try {
      // Simulate ZK proof verification
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('ZK identity verified successfully!')
      setProfile(prev => prev ? { ...prev, verified: true } : null)
    } catch (error) {
      toast.error('Failed to verify ZK identity. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleUpdatePreferences = (key: string, value: any) => {
    setProfile(prev => prev ? {
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    } : null)
    toast.success('Preferences updated')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!isConnected || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your wallet to view your profile and governance activity.
          </p>
          <Button className="btn-primary">
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile & Identity
          </h1>
          <p className="text-gray-600">
            Manage your identity, voting power, and governance preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="identity">Identity</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Profile Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Wallet Address</label>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-mono text-sm">{formatAddress(profile.address)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCopyAddress}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Voting Power</label>
                          <div className="text-lg font-semibold text-gray-900">
                            {profile.votingPower} CIVIC
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Reputation Score</label>
                          <div className="flex items-center space-x-2">
                            <div className="text-lg font-semibold text-gray-900">
                              {profile.reputation}/100
                            </div>
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              High
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Member Since</label>
                          <div className="text-sm text-gray-900">
                            {new Date(profile.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Total Votes</label>
                          <div className="text-lg font-semibold text-gray-900">
                            {profile.totalVotes}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Proposals Created</label>
                          <div className="text-lg font-semibold text-gray-900">
                            {profile.proposalsCreated}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Voting History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Voting Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { proposal: 'New Bike Lane Infrastructure', vote: 'For', date: '2 days ago' },
                        { proposal: 'Community Garden Expansion', vote: 'For', date: '1 week ago' },
                        { proposal: 'Digital Library Access', vote: 'Against', date: '2 weeks ago' },
                      ].map((vote, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{vote.proposal}</div>
                            <div className="text-sm text-gray-500">{vote.date}</div>
                          </div>
                          <Badge className={
                            vote.vote === 'For' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }>
                            {vote.vote}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Identity Tab */}
              <TabsContent value="identity" className="space-y-6">
                {/* ZK-Proof Identity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Zero-Knowledge Identity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          profile.verified ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {profile.verified ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {profile.verified ? 'Identity Verified' : 'Identity Not Verified'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {profile.verified 
                              ? 'Your ZK-proof identity is verified and active'
                              : 'Verify your identity to participate in governance'
                            }
                          </div>
                        </div>
                      </div>
                      <Badge className={
                        profile.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {profile.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>

                    {profile.verified && profile.identityHash && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Identity Hash</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={profile.identityHash}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button variant="outline" size="sm" onClick={() => {
                            navigator.clipboard.writeText(profile.identityHash!)
                            toast.success('Identity hash copied')
                          }}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {!profile.verified && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2">
                            ZK-Proof (Placeholder)
                          </label>
                          <Textarea
                            placeholder="Enter your ZK-proof here..."
                            value={zkProof}
                            onChange={(e) => setZkProof(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            In a real implementation, this would be generated by a ZK-proof system
                          </p>
                        </div>
                        
                        <Button
                          onClick={handleVerifyZKIdentity}
                          disabled={!zkProof.trim() || isVerifying}
                          className="btn-primary"
                        >
                          {isVerifying ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Verify Identity
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="h-5 w-5 mr-2" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Show Voting History</div>
                        <div className="text-sm text-gray-500">Make your voting history public</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Anonymous Voting</div>
                        <div className="text-sm text-gray-500">Use ZK-proofs for anonymous voting</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Governance Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{profile.totalVotes}</div>
                          <div className="text-sm text-blue-600">Total Votes</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{profile.proposalsCreated}</div>
                          <div className="text-sm text-green-600">Proposals Created</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{profile.reputation}</div>
                          <div className="text-sm text-purple-600">Reputation Score</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Email Notifications</div>
                          <div className="text-sm text-gray-500">Receive updates about proposals and votes</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdatePreferences('notifications', !profile.preferences.notifications)}
                        >
                          {profile.preferences.notifications ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Theme</div>
                          <div className="text-sm text-gray-500">Choose your preferred theme</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdatePreferences('theme', 
                            profile.preferences.theme === 'light' ? 'dark' : 'light'
                          )}
                        >
                          {profile.preferences.theme === 'light' ? 'Light' : 'Dark'}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Language</div>
                          <div className="text-sm text-gray-500">Select your preferred language</div>
                        </div>
                        <Button variant="outline" size="sm">
                          English
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Wallet Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-mono text-sm">{formatAddress(profile.address)}</span>
                    <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Balance</label>
                  <div className="text-lg font-semibold text-gray-900">
                    {balance ? formatCurrency(parseFloat(balance.formatted)) : 'Loading...'}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">CIVIC Tokens</label>
                  <div className="text-lg font-semibold text-gray-900">
                    {profile.balance} CIVIC
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full btn-primary">
                  <User className="h-4 w-4 mr-2" />
                  View Proposals
                </Button>
                <Button variant="outline" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
