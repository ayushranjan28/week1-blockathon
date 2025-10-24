'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Eye,
  Edit
} from 'lucide-react'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { ResponsiveContainer, ResponsiveText } from '@/components/ui/responsive-container'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export default function AdminProposalsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors">

      {/* Proposals Management */}
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
              Proposal Management
            </ResponsiveText>
            <ResponsiveText 
              size={{ default: 'base', sm: 'lg' }}
              color="muted"
            >
              Review, approve, and manage community proposals
            </ResponsiveText>
          </motion.div>

          {/* Render the admin dashboard with proposals tab active */}
          <AdminDashboard initialTab="proposals" />
        </div>
      </ResponsiveContainer>
    </div>
  )
}
