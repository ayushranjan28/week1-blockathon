'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EnhancedProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent'
  showValue?: boolean
  animated?: boolean
  striped?: boolean
  className?: string
  label?: string
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
}

const variantClasses = {
  default: 'bg-primary-600 dark:bg-primary-500',
  success: 'bg-success-600 dark:bg-success-500',
  warning: 'bg-warning-600 dark:bg-warning-500',
  error: 'bg-error-600 dark:bg-error-500',
  accent: 'bg-accent-600 dark:bg-accent-500'
}

export function EnhancedProgress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showValue = false,
  animated = true,
  striped = false,
  className,
  label
}: EnhancedProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
            {label}
          </span>
          {showValue && (
            <span className="text-sm text-gray-500 dark:text-neutral-400">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        'w-full bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <motion.div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            variantClasses[variant],
            striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px] animate-pulse'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 0.8 : 0,
            ease: 'easeOut'
          }}
        />
      </div>
      
      {!label && showValue && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent'
  showValue?: boolean
  animated?: boolean
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showValue = true,
  animated = true,
  className
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    default: 'stroke-primary-600 dark:stroke-primary-500',
    success: 'stroke-success-600 dark:stroke-success-500',
    warning: 'stroke-warning-600 dark:stroke-warning-500',
    error: 'stroke-error-600 dark:stroke-error-500',
    accent: 'stroke-accent-600 dark:stroke-accent-500'
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-neutral-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={colorClasses[variant]}
          initial={{ strokeDasharray, strokeDashoffset: circumference }}
          animate={{ strokeDasharray, strokeDashoffset }}
          transition={{ 
            duration: animated ? 1 : 0,
            ease: 'easeInOut'
          }}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-700 dark:text-neutral-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}
