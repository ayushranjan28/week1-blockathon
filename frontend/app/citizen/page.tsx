'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Vote, 
  FileText, 
  TrendingUp, 
  Users, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EnhancedProgress } from '@/components/ui/enhanced-progress'
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText } from '@/components/ui/responsive-container'
import { ThemeToggleSimple } from '@/components/ui/theme-toggle'
import { ConnectWallet } from '@/components/wallet/connect-wallet'
import { CitizenDashboard } from '@/components/dashboard/citizen-dashboard'
import { useAccount } from 'wagmi'

export default function CitizenPage() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 transition-colors">
        {/* Header */}
        <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-50 transition-colors">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-neutral-100">Civic DAO</span>
                <span className="text-sm text-gray-500 dark:text-neutral-400">Citizen Portal</span>
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
                <ResponsiveText 
                  size={{ default: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
                  weight="bold"
                  className="mb-6"
                >
                  Shape Your City's Future
                </ResponsiveText>
                <ResponsiveText 
                  size={{ default: 'lg', sm: 'xl', md: '2xl' }}
                  color="muted"
                  className="max-w-3xl mx-auto mb-8"
                >
                  Join the future of civic participation. Vote on city initiatives, 
                  propose solutions, and shape your community through decentralized, 
                  transparent governance.
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

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-neutral-900 transition-colors">
          <ResponsiveContainer maxWidth="full" padding="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <ResponsiveText 
                size={{ default: '2xl', sm: '3xl', md: '4xl' }}
                weight="bold"
                className="mb-4"
              >
                Citizen Features
              </ResponsiveText>
              <ResponsiveText 
                size={{ default: 'base', sm: 'lg', md: 'xl' }}
                color="muted"
                className="max-w-2xl mx-auto"
              >
                Participate in transparent, community-driven decision making
              </ResponsiveText>
            </motion.div>

            <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }} gap="lg">
              {[
                {
                  icon: Vote,
                  title: 'Vote on Proposals',
                  description: 'Participate in city governance by voting on community proposals',
                  color: 'text-blue-600 dark:text-blue-400',
                  bgColor: 'bg-blue-50 dark:bg-blue-900/20'
                },
                {
                  icon: FileText,
                  title: 'Create Proposals',
                  description: 'Submit your own ideas for city improvement and community projects',
                  color: 'text-green-600 dark:text-green-400',
                  bgColor: 'bg-green-50 dark:bg-green-900/20'
                },
                {
                  icon: Shield,
                  title: 'ZK Identity Verification',
                  description: 'Verify your identity privately using zero-knowledge proofs',
                  color: 'text-purple-600 dark:text-purple-400',
                  bgColor: 'bg-purple-50 dark:bg-purple-900/20'
                },
                {
                  icon: TrendingUp,
                  title: 'Track Progress',
                  description: 'Monitor proposal outcomes and city development progress',
                  color: 'text-orange-600 dark:text-orange-400',
                  bgColor: 'bg-orange-50 dark:bg-orange-900/20'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <EnhancedCard variant="hover" animation="hover">
                    <EnhancedCardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <ResponsiveText 
                        size={{ default: 'lg', sm: 'xl' }}
                        weight="semibold"
                        className="mb-2"
                      >
                        {feature.title}
                      </ResponsiveText>
                      <ResponsiveText 
                        size={{ default: 'sm', sm: 'base' }}
                        color="muted"
                      >
                        {feature.description}
                      </ResponsiveText>
                    </EnhancedCardContent>
                  </EnhancedCard>
                </motion.div>
              ))}
            </ResponsiveGrid>
          </ResponsiveContainer>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors">
      {/* Dashboard */}
      <CitizenDashboard />
    </div>
  )
}
