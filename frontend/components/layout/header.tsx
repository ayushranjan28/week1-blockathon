'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Wallet, User, Settings, LogOut, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConnectWallet } from '@/components/wallet/connect-wallet'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { MobileNav } from '@/components/layout/mobile-nav'
import { ThemeToggleSimple } from '@/components/ui/theme-toggle'
import { useAccount, useDisconnect } from 'wagmi'

const citizenNavigation = [
  { name: 'Dashboard', href: '/citizen', icon: Users },
  { name: 'Proposals', href: '/proposals', icon: Users },
  { name: 'Create', href: '/create', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'ZK Identity', href: '/zk-identity', icon: Shield },
]

const adminNavigation = [
  { name: 'Overview', href: '/admin', icon: Users },
  { name: 'Proposals', href: '/admin/proposals', icon: Users },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function Header() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const pathname = usePathname()
  
  // Determine current interface based on pathname
  const isAdminInterface = pathname.startsWith('/admin')
  const isCitizenInterface = pathname.startsWith('/citizen') || (!pathname.startsWith('/admin') && pathname !== '/')
  
  const currentNavigation = isAdminInterface ? adminNavigation : citizenNavigation
  const interfaceColor = isAdminInterface ? 'red' : 'primary'

  return (
    <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-700 sticky top-0 z-50 transition-colors">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className={`w-8 h-8 bg-${interfaceColor}-600 rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">
                  {isAdminInterface ? 'A' : 'C'}
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-neutral-100">Civic DAO</span>
              {isAdminInterface && (
                <span className="text-sm text-red-600 dark:text-red-400 font-medium ml-2 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded">
                  Admin Portal
                </span>
              )}
              {isCitizenInterface && !pathname.startsWith('/admin') && (
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium ml-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded">
                  Citizen Portal
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {currentNavigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/citizen' && item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    isActive
                      ? `bg-${interfaceColor}-100 text-${interfaceColor}-700 dark:bg-${interfaceColor}-900/30 dark:text-${interfaceColor}-300`
                      : 'text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-gray-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggleSimple />
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <NotificationBell />
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-neutral-400">
                  <Wallet className="h-4 w-4" />
                  <span className="font-mono">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => disconnect()}
                  className="text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <ConnectWallet />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  )
}
