'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'hover'
  animation?: 'none' | 'hover' | 'float' | 'glow'
  children: React.ReactNode
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = 'default', animation = 'hover', children, ...props }, ref) => {
    const baseClasses = 'rounded-xl border transition-all duration-300'
    
    const variantClasses = {
      default: 'border-secondary-200 bg-white shadow-soft dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-strong',
      glass: 'border-white/20 bg-white/80 backdrop-blur-sm dark:border-neutral-700/20 dark:bg-neutral-800/80',
      gradient: 'border-secondary-200 bg-gradient-to-br from-white to-primary-50 dark:border-neutral-700 dark:from-neutral-800 dark:to-primary-900/20',
      hover: 'border-secondary-200 bg-white shadow-soft hover:shadow-medium hover:-translate-y-1 hover:scale-[1.02] dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-strong dark:hover:shadow-strong'
    }
    
    const animationClasses = {
      none: '',
      hover: 'hover:shadow-medium hover:-translate-y-1 hover:scale-[1.02]',
      float: 'animate-float',
      glow: 'animate-glow'
    }

    const cardContent = (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          animationClasses[animation],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )

    if (animation === 'float' || animation === 'glow') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {cardContent}
        </motion.div>
      )
    }

    return cardContent
  }
)

EnhancedCard.displayName = 'EnhancedCard'

const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
EnhancedCardHeader.displayName = 'EnhancedCardHeader'

const EnhancedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-neutral-100', className)}
    {...props}
  />
))
EnhancedCardTitle.displayName = 'EnhancedCardTitle'

const EnhancedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-secondary-500 dark:text-neutral-400', className)}
    {...props}
  />
))
EnhancedCardDescription.displayName = 'EnhancedCardDescription'

const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
EnhancedCardContent.displayName = 'EnhancedCardContent'

const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
EnhancedCardFooter.displayName = 'EnhancedCardFooter'

export { 
  EnhancedCard, 
  EnhancedCardHeader, 
  EnhancedCardFooter, 
  EnhancedCardTitle, 
  EnhancedCardDescription, 
  EnhancedCardContent 
}
