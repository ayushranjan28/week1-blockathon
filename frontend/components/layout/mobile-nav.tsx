'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  BarChart3, 
  Plus, 
  User, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { useAccount, useDisconnect } from 'wagmi'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Proposals', href: '/proposals', icon: BarChart3 },
  { name: 'Create', href: '/create', icon: Plus },
  { name: 'Profile', href: '/profile', icon: User },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { user } = useAuth()

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">Civic DAO</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto">
                  <nav className="p-4 space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                        {isActive(item.href) && (
                          <div className="w-2 h-2 bg-primary-600 rounded-full ml-auto" />
                        )}
                      </Link>
                    ))}
                  </nav>

                  {/* User Section */}
                  {isConnected && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {user?.verified ? 'Verified Member' : 'Member'}
                            </div>
                            <div className="text-sm text-gray-500 font-mono">
                              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                            </div>
                          </div>
                          {user?.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          )}
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-gray-900">Notifications</span>
                          </div>
                          <NotificationBell />
                        </div>

                        {/* Quick Stats */}
                        {user && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg text-center">
                              <div className="text-lg font-bold text-blue-600">{user.totalVotes}</div>
                              <div className="text-xs text-blue-600">Votes Cast</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg text-center">
                              <div className="text-lg font-bold text-green-600">{user.proposalsCreated}</div>
                              <div className="text-xs text-green-600">Proposals</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-2">
                      {isConnected ? (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              disconnect()
                              setIsOpen(false)
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Disconnect Wallet
                          </Button>
                        </>
                      ) : (
                        <Button className="w-full btn-primary">
                          Connect Wallet
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
