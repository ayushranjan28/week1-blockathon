'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  DollarSign, 
  Tag, 
  User,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

interface SearchFilters {
  query: string
  category: string
  status: string
  proposer: string
  budgetRange: [number, number]
  dateRange: {
    start: string
    end: string
  }
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  initialFilters?: Partial<SearchFilters>
}

const categories = [
  'All Categories',
  'Infrastructure',
  'Environment',
  'Education',
  'Healthcare',
  'Transportation',
  'Safety',
  'Culture',
  'Technology',
  'Other'
]

const statuses = [
  'All Status',
  'Active',
  'Succeeded',
  'Defeated',
  'Executed',
  'Canceled',
  'Expired'
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'budget-high', label: 'Highest Budget' },
  { value: 'budget-low', label: 'Lowest Budget' },
  { value: 'votes-high', label: 'Most Votes' },
  { value: 'votes-low', label: 'Least Votes' },
  { value: 'title', label: 'Title A-Z' }
]

export function AdvancedSearch({ onFiltersChange, initialFilters = {} }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'All Categories',
    status: 'All Status',
    proposer: '',
    budgetRange: [0, 1000000],
    dateRange: {
      start: '',
      end: ''
    },
    sortBy: 'newest',
    sortOrder: 'desc',
    ...initialFilters
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    // Update active filters based on current filter values
    const active: string[] = []
    
    if (filters.query) active.push(`Search: "${filters.query}"`)
    if (filters.category !== 'All Categories') active.push(`Category: ${filters.category}`)
    if (filters.status !== 'All Status') active.push(`Status: ${filters.status}`)
    if (filters.proposer) active.push(`Proposer: ${filters.proposer}`)
    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 1000000) {
      active.push(`Budget: $${filters.budgetRange[0].toLocaleString()} - $${filters.budgetRange[1].toLocaleString()}`)
    }
    if (filters.dateRange.start || filters.dateRange.end) {
      active.push(`Date: ${filters.dateRange.start || 'Any'} to ${filters.dateRange.end || 'Any'}`)
    }
    
    setActiveFilters(active)
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilter = (filterKey: keyof SearchFilters) => {
    const defaultValues: Partial<SearchFilters> = {
      query: '',
      category: 'All Categories',
      status: 'All Status',
      proposer: '',
      budgetRange: [0, 1000000],
      dateRange: { start: '', end: '' },
      sortBy: 'newest',
      sortOrder: 'desc'
    }
    
    setFilters(prev => ({ ...prev, [filterKey]: defaultValues[filterKey] }))
  }

  const clearAllFilters = () => {
    setFilters({
      query: '',
      category: 'All Categories',
      status: 'All Status',
      proposer: '',
      budgetRange: [0, 1000000],
      dateRange: { start: '', end: '' },
      sortBy: 'newest',
      sortOrder: 'desc'
    })
  }

  const getSortIcon = (sortBy: string) => {
    switch (sortBy) {
      case 'newest':
      case 'budget-high':
      case 'votes-high':
        return <TrendingUp className="h-4 w-4" />
      case 'oldest':
      case 'budget-low':
      case 'votes-low':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Advanced Search
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFilters.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {isExpanded ? 'Less' : 'More'} Filters
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {activeFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  // Find and clear the corresponding filter
                  if (filter.startsWith('Search:')) clearFilter('query')
                  else if (filter.startsWith('Category:')) clearFilter('category')
                  else if (filter.startsWith('Status:')) clearFilter('status')
                  else if (filter.startsWith('Proposer:')) clearFilter('proposer')
                  else if (filter.startsWith('Budget:')) clearFilter('budgetRange')
                  else if (filter.startsWith('Date:')) clearFilter('dateRange')
                }}
              >
                {filter}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search proposals, descriptions, or proposers..."
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger>
                <Tag className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <CheckCircle className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Proposer Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Proposer Address
                  </label>
                  <Input
                    placeholder="0x..."
                    value={filters.proposer}
                    onChange={(e) => updateFilter('proposer', e.target.value)}
                    className="font-mono"
                  />
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <div className="flex space-x-2">
                    <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                      <SelectTrigger className="flex-1">
                        {getSortIcon(filters.sortBy)}
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {filters.sortOrder === 'asc' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Budget Range
                </label>
                <div className="space-y-3">
                  <Slider
                    value={filters.budgetRange}
                    onValueChange={(value: [number, number]) => updateFilter('budgetRange', value)}
                    max={1000000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${filters.budgetRange[0].toLocaleString()}</span>
                    <span>${filters.budgetRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date Range
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="date"
                      placeholder="Start Date"
                      value={filters.dateRange.start}
                      onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      placeholder="End Date"
                      value={filters.dateRange.end}
                      onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
