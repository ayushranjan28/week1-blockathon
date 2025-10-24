'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Settings
} from 'lucide-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { ResponsiveContainer, ResponsiveText } from '@/components/ui/responsive-container'
import { ThemeToggleSimple } from '@/components/ui/theme-toggle'
import { ConnectWallet } from '@/components/wallet/connect-wallet'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { useAccount } from 'wagmi'

export default function AdminPage() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 transition-colors">
        {/* Header */}
        <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-50 transition-colors">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-neutral-100">Civic DAO</span>
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">Admin Portal</span>
              </div>
              <ThemeToggleSimple />
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16">
          <ResponsiveContainer maxWidth="2xl" padding="lg">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <ResponsiveText 
                  size={{ default: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
                  weight="bold"
                  className="mb-6"
                >
                  Admin Dashboard
                </ResponsiveText>
                <ResponsiveText 
                  size={{ default: 'lg', sm: 'xl', md: '2xl' }}
                  color="muted"
                  className="max-w-3xl mx-auto mb-8"
                >
                  Manage city governance, review proposals, and oversee the DAO operations
                  with comprehensive administrative tools.
                </ResponsiveText>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <ConnectWallet />
                <EnhancedButton variant="outline" size="lg">
                  Learn More
                </EnhancedButton>
              </motion.div>
            </div>
          </ResponsiveContainer>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors">
      <AdminDashboard />
    </div>
  )
}
