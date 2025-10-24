'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Download,
  Shield
} from 'lucide-react'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { ResponsiveContainer, ResponsiveText } from '@/components/ui/responsive-container'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors">

      {/* User Management */}
      <ResponsiveContainer maxWidth="full" padding="lg">
        <div className="space-y-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResponsiveText 
              size={{ default: '2xl', sm: '3xl', md: '4xl' }}
              weight="bold"
              className="mb-4"
            >
              User Management
            </ResponsiveText>
            <ResponsiveText 
              size={{ default: 'base', sm: 'lg' }}
              color="muted"
            >
              Manage user verifications and ZK identity issuance
            </ResponsiveText>
          </motion.div>

          {/* Render the admin dashboard with users tab active */}
          <AdminDashboard initialTab="users" />
        </div>
      </ResponsiveContainer>
    </div>
  )
}
