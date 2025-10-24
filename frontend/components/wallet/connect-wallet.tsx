'use client'

import { useState } from 'react'
import { useConnect, useAccount } from 'wagmi'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ChevronDown, Check, Smartphone, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const connectors = [
  {
    name: 'MetaMask',
    id: 'metaMask',
    icon: '🦊',
    description: 'Connect using MetaMask browser extension',
    popular: true,
  },
  {
    name: 'WalletConnect',
    id: 'walletConnect',
    icon: '🔗',
    description: 'Connect using WalletConnect mobile app',
    popular: true,
  },
  {
    name: 'Coinbase Wallet',
    id: 'coinbaseWallet',
    icon: '🔵',
    description: 'Connect using Coinbase Wallet',
    popular: true,
  },
  {
    name: 'Injected',
    id: 'injected',
    icon: '💳',
    description: 'Connect using any injected wallet',
    popular: false,
  },
]

export function ConnectWallet() {
  const [isOpen, setIsOpen] = useState(false)
  const { connect, connectors: wagmiConnectors, isPending } = useConnect()
  const { isConnected } = useAccount()

  const handleConnect = async (connectorId: string) => {
    try {
      const connector = wagmiConnectors.find(c => c.id === connectorId)
      if (!connector) {
        throw new Error('Connector not found')
      }
      
      await connect({ connector })
      setIsOpen(false)
      toast.success('Wallet connected successfully!')
    } catch (error) {
      console.error('Connection error:', error)
      toast.error('Failed to connect wallet. Please try again.')
    }
  }

  if (isConnected) {
    return null
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary"
        disabled={isPending}
      >
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-strong border border-gray-200 z-50"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Connect Your Wallet
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Choose a wallet to connect and start participating in governance.
                </p>
                
                <div className="space-y-2">
                  {/* Popular wallets */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Wallets</h4>
                    <div className="space-y-2">
                      {connectors.filter(c => c.popular).map((connector) => (
                        <button
                          key={connector.id}
                          onClick={() => handleConnect(connector.id)}
                          disabled={isPending}
                          className="w-full flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
                        >
                          <div className="text-2xl mr-3">{connector.icon}</div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 group-hover:text-primary-700">
                              {connector.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {connector.description}
                            </div>
                          </div>
                          {isPending && (
                            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Other wallets */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Other Options</h4>
                    <div className="space-y-2">
                      {connectors.filter(c => !c.popular).map((connector) => (
                        <button
                          key={connector.id}
                          onClick={() => handleConnect(connector.id)}
                          disabled={isPending}
                          className="w-full flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
                        >
                          <div className="text-2xl mr-3">{connector.icon}</div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 group-hover:text-primary-700">
                              {connector.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {connector.description}
                            </div>
                          </div>
                          {isPending && (
                            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    By connecting a wallet, you agree to our{' '}
                    <a href="/terms" className="text-primary-600 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
