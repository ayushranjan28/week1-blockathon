'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse' | 'bounce' | 'bars'
  color?: 'primary' | 'secondary' | 'accent' | 'white'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}

const colorClasses = {
  primary: 'text-primary-600 dark:text-primary-400',
  secondary: 'text-secondary-600 dark:text-secondary-400',
  accent: 'text-accent-600 dark:text-accent-400',
  white: 'text-white'
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  color = 'primary',
  className 
}: LoadingSpinnerProps) {
  const baseClasses = cn(
    sizeClasses[size],
    colorClasses[color],
    className
  )

  if (variant === 'dots') {
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn('rounded-full bg-current', size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-3 w-3' : 'h-2.5 w-2.5')}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn('rounded-full bg-current', baseClasses)}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1,
          repeat: Infinity
        }}
      />
    )
  }

  if (variant === 'bounce') {
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn('rounded-full bg-current', size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-3 w-3' : 'h-2.5 w-2.5')}
            animate={{
              y: [0, -8, 0]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.1
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'bars') {
    return (
      <div className="flex space-x-1 items-end">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className={cn('bg-current rounded-sm', size === 'sm' ? 'h-3 w-1' : size === 'lg' ? 'h-6 w-1.5' : 'h-4 w-1')}
            animate={{
              height: ['20%', '100%', '20%']
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.1
            }}
          />
        ))}
      </div>
    )
  }

  // Default spinner
  return (
    <motion.div
      className={cn('border-2 border-current border-t-transparent rounded-full', baseClasses)}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )
}

interface LoadingOverlayProps {
  children: React.ReactNode
  loading: boolean
  spinner?: React.ReactNode
  message?: string
}

export function LoadingOverlay({ 
  children, 
  loading, 
  spinner,
  message = 'Loading...' 
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="flex flex-col items-center space-y-4">
            {spinner || <LoadingSpinner size="lg" />}
            {message && (
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                {message}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
