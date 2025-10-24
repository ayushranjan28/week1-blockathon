import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatNumber(num: number | string, decimals = 2): string {
  const n = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(n)) return '0'
  
  if (n >= 1e9) return (n / 1e9).toFixed(decimals) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(decimals) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(decimals) + 'K'
  return n.toFixed(decimals)
}

export function formatCurrency(amount: number | string, currency = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '$0.00'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatDate(date: number | Date): string {
  const d = typeof date === 'number' ? new Date(date * 1000) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatRelativeTime(date: number | Date): string {
  const d = typeof date === 'number' ? new Date(date * 1000) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  return `${Math.floor(diffInSeconds / 31536000)}y ago`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getProposalStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'text-blue-600 bg-blue-100'
    case 'succeeded':
      return 'text-green-600 bg-green-100'
    case 'defeated':
      return 'text-red-600 bg-red-100'
    case 'executed':
      return 'text-purple-600 bg-purple-100'
    case 'canceled':
      return 'text-gray-600 bg-gray-100'
    case 'expired':
      return 'text-orange-600 bg-orange-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getCategoryColor(category: string): string {
  const colors = {
    'Infrastructure': 'bg-blue-100 text-blue-800',
    'Environment': 'bg-green-100 text-green-800',
    'Education': 'bg-purple-100 text-purple-800',
    'Healthcare': 'bg-red-100 text-red-800',
    'Transportation': 'bg-yellow-100 text-yellow-800',
    'Safety': 'bg-orange-100 text-orange-800',
    'Culture': 'bg-pink-100 text-pink-800',
    'Technology': 'bg-cyan-100 text-cyan-800',
    'Other': 'bg-gray-100 text-gray-800',
  }
  return colors[category as keyof typeof colors] || colors['Other']
}

export function calculateVotingPower(balance: string, totalSupply: string): number {
  const userBalance = parseFloat(balance)
  const total = parseFloat(totalSupply)
  if (total === 0) return 0
  return (userBalance / total) * 100
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
