'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Shared types
export interface Proposal {
  id: string | number
  title: string
  description: string
  proposer: string
  budget: string | number
  category: string
  status: 'active' | 'pending' | 'passed' | 'rejected' | 'executed'
  votes: number
  totalVotes: number
  createdAt: string | number
  deadline: string
  executed?: boolean
  canceled?: boolean
}

export interface Citizen {
  address: string
  verified: boolean
  votingPower: number
  registrationTime: number
  metadata: string
}

export interface TreasuryInfo {
  balance: number
  totalDistributed: number
  totalBurned: number
}

// Shared utility functions
export const formatAddress = (address: string, length: number = 6): string => {
  if (!address) return ''
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export const formatCurrency = (amount: number | string, currency: string = 'USD'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount)
}

export const formatDate = (timestamp: number | string): string => {
  const date = new Date(typeof timestamp === 'string' ? timestamp : timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatTimeAgo = (timestamp: number | string): string => {
  const now = Date.now()
  const time = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp * 1000
  const diff = now - time
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'passed':
    case 'executed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Infrastructure': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Environment': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Education': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'Healthcare': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Transportation': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'Safety': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Culture': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    'Technology': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  }
  return colors[category] || colors['Other']
}

// Shared components
interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
      getStatusColor(status),
      className
    )}>
      {status}
    </span>
  )
}

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
      getCategoryColor(category),
      className
    )}>
      {category}
    </span>
  )
}

interface AddressDisplayProps {
  address: string
  length?: number
  className?: string
}

export function AddressDisplay({ address, length = 6, className }: AddressDisplayProps) {
  return (
    <span className={cn('font-mono text-sm', className)}>
      {formatAddress(address, length)}
    </span>
  )
}

interface CurrencyDisplayProps {
  amount: number | string
  currency?: string
  className?: string
}

export function CurrencyDisplay({ amount, currency = 'USD', className }: CurrencyDisplayProps) {
  return (
    <span className={cn('font-medium', className)}>
      {formatCurrency(amount, currency)}
    </span>
  )
}

interface DateDisplayProps {
  timestamp: number | string
  format?: 'date' | 'timeAgo'
  className?: string
}

export function DateDisplay({ timestamp, format = 'date', className }: DateDisplayProps) {
  const formatted = format === 'timeAgo' ? formatTimeAgo(timestamp) : formatDate(timestamp)
  return (
    <span className={cn('text-sm text-gray-600 dark:text-neutral-400', className)}>
      {formatted}
    </span>
  )
}

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600 dark:text-neutral-400">{message}</p>
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center p-12', className)}>
      {icon && (
        <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action}
    </div>
  )
}

interface ErrorStateProps {
  title: string
  description: string
  error?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ title, description, error, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('text-center p-12', className)}>
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-neutral-400 mb-4 max-w-md mx-auto">
        {description}
      </p>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4 font-mono">
          {error}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

// Animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}
