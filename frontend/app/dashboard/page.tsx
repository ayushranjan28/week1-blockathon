'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  Users, 
  Vote, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProposalCard } from '@/components/proposals/proposal-card'
import { GovernanceStats } from '@/components/dashboard/governance-stats'
import { GovernanceAnalytics } from '@/components/analytics/governance-analytics'
import { AdvancedSearch } from '@/components/search/advanced-search'
import { EnhancedDashboard } from '@/components/dashboard/enhanced-dashboard'
import { useAccount } from 'wagmi'
import { ConnectWallet } from '@/components/wallet/connect-wallet'

// Mock data - replace with real data from your API
const mockProposals = [
  {
    id: '1',
    title: 'New Bike Lane Infrastructure',
    description: 'Proposal to add dedicated bike lanes on Main Street to improve cycling safety and promote sustainable transportation.',
    proposer: '0x1234...5678',
    budget: '50000',
    category: 'Infrastructure',
    status: 'active' as const,
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
  },
  {
    id: '2',
    title: 'Community Garden Expansion',
    description: 'Expand the community garden program to include 5 new locations across the city.',
    proposer: '0x9876...5432',
    budget: '25000',
    category: 'Environment',
    status: 'succeeded' as const,
    createdAt: Date.now() - 86400000 * 7, // 1 week ago
    startBlock: 999000,
    endBlock: 1000000,
    votesFor: 2100,
    votesAgainst: 400,
    votesAbstain: 100,
    totalVotes: 2600,
    quorum: 1000,
    executed: false,
    canceled: false,
  },
  {
    id: '3',
    title: 'Digital Library Access',
    description: 'Implement free digital library access for all residents with e-books and online resources.',
    proposer: '0x4567...8901',
    budget: '75000',
    category: 'Education',
    status: 'defeated' as const,
    createdAt: Date.now() - 86400000 * 14, // 2 weeks ago
    startBlock: 998000,
    endBlock: 999000,
    votesFor: 800,
    votesAgainst: 1200,
    votesAbstain: 200,
    totalVotes: 2200,
    quorum: 1000,
    executed: false,
    canceled: false,
  },
]

const statusFilters = [
  { value: 'all', label: 'All Proposals', count: 12 },
  { value: 'active', label: 'Active', count: 3 },
  { value: 'succeeded', label: 'Succeeded', count: 5 },
  { value: 'defeated', label: 'Defeated', count: 2 },
  { value: 'executed', label: 'Executed', count: 2 },
]

const categoryFilters = [
  'All Categories',
  'Infrastructure',
  'Environment',
  'Education',
  'Healthcare',
  'Transportation',
  'Safety',
  'Culture',
  'Technology',
  'Other',
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [sortBy, setSortBy] = useState('newest')
  const [searchFilters, setSearchFilters] = useState({})
  const { isConnected } = useAccount()

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    const matchesCategory = categoryFilter === 'All Categories' || proposal.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Vote className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-gray-600 mb-8">
              Connect your wallet to view proposals, vote on initiatives, 
              and participate in governance.
            </p>
            <ConnectWallet />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors">
      <EnhancedDashboard />
    </div>
  )
}
