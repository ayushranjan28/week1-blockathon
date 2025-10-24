'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAccount, useBalance } from 'wagmi'
import toast from 'react-hot-toast'

interface User {
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

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  verifyIdentity: (zkProof: string) => Promise<boolean>
  updatePreferences: (preferences: Partial<User['preferences']>) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })

  const isAuthenticated = isConnected && user !== null

  useEffect(() => {
    if (isConnected && address) {
      fetchUser()
    } else {
      setUser(null)
    }
  }, [isConnected, address])

  const fetchUser = async () => {
    if (!address) return

    setLoading(true)
    try {
      // In a real app, this would fetch from your API
      const mockUser: User = {
        address,
        balance: balance?.formatted || '0',
        votingPower: balance?.formatted || '0',
        verified: false,
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
      
      setUser(mockUser)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      toast.error('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const verifyIdentity = async (zkProof: string): Promise<boolean> => {
    if (!user) return false

    try {
      // Simulate ZK proof verification
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const identityHash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      setUser(prev => prev ? {
        ...prev,
        verified: true,
        identityHash
      } : null)
      
      toast.success('Identity verified successfully!')
      return true
    } catch (error) {
      console.error('Identity verification failed:', error)
      toast.error('Failed to verify identity')
      return false
    }
  }

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (!user) return

    setUser(prev => prev ? {
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preferences
      }
    } : null)
    
    toast.success('Preferences updated')
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        verifyIdentity,
        updatePreferences,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
