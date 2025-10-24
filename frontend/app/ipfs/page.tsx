'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Settings
} from 'lucide-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { ResponsiveContainer, ResponsiveText } from '@/components/ui/responsive-container'
import { ThemeToggleSimple } from '@/components/ui/theme-toggle'
import { ConnectWallet } from '@/components/wallet/connect-wallet'
import { IPFSUploader } from '@/components/ipfs/ipfs-uploader'
import { useAccount } from 'wagmi'

export default function IPFSPage() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 transition-colors">
        {/* Header */}
        <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-50 transition-colors">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">I</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-neutral-100">Civic DAO</span>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">IPFS Storage</span>
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
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <ResponsiveText 
                  size={{ default: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
                  weight="bold"
                  className="mb-6"
                >
                  IPFS Storage
                </ResponsiveText>
                <ResponsiveText 
                  size={{ default: 'lg', sm: 'xl', md: '2xl' }}
                  color="muted"
                  className="max-w-3xl mx-auto mb-8"
                >
                  Upload files to decentralized storage for proposal attachments and documents. 
                  Your files are stored permanently and immutably on the IPFS network.
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
                Decentralized File Storage
              </ResponsiveText>
              <ResponsiveText 
                size={{ default: 'base', sm: 'lg', md: 'xl' }}
                color="muted"
                className="max-w-2xl mx-auto"
              >
                Store your files securely on the decentralized web
              </ResponsiveText>
            </motion.div>

            <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap="lg">
              {[
                {
                  icon: Upload,
                  title: 'Decentralized Storage',
                  description: 'Files are stored across a distributed network of nodes',
                  color: 'text-blue-600 dark:text-blue-400',
                  bgColor: 'bg-blue-50 dark:bg-blue-900/20'
                },
                {
                  icon: Upload,
                  title: 'Permanent & Immutable',
                  description: 'Once uploaded, files cannot be modified or deleted',
                  color: 'text-green-600 dark:text-green-400',
                  bgColor: 'bg-green-50 dark:bg-green-900/20'
                },
                {
                  icon: Upload,
                  title: 'Content Addressing',
                  description: 'Files are identified by their content, not location',
                  color: 'text-purple-600 dark:text-purple-400',
                  bgColor: 'bg-purple-50 dark:bg-purple-900/20'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="p-6 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className={`w-16 h-16 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <ResponsiveText 
                      size={{ default: 'lg', sm: 'xl' }}
                      weight="semibold"
                      className="mb-2 text-center"
                    >
                      {feature.title}
                    </ResponsiveText>
                    <ResponsiveText 
                      size={{ default: 'sm', sm: 'base' }}
                      color="muted"
                      className="text-center"
                    >
                      {feature.description}
                    </ResponsiveText>
                  </div>
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
      {/* Header */}
      <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-50 transition-colors">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-neutral-100">Civic DAO</span>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">IPFS Storage</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggleSimple />
              <EnhancedButton variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </EnhancedButton>
            </div>
          </div>
        </nav>
      </header>

      {/* IPFS Uploader */}
      <IPFSUploader />
    </div>
  )
}
