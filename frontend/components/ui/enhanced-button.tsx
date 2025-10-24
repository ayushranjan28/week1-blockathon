'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const enhancedButtonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-neutral-900',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700 shadow-sm hover:shadow-md',
        secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:active:bg-neutral-600',
        outline: 'border border-secondary-300 bg-transparent hover:bg-secondary-50 active:bg-secondary-100 dark:border-neutral-600 dark:hover:bg-neutral-800 dark:active:bg-neutral-700 dark:text-neutral-100',
        ghost: 'hover:bg-secondary-100 active:bg-secondary-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700 dark:text-neutral-100',
        destructive: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 dark:bg-error-500 dark:hover:bg-error-600 dark:active:bg-error-700',
        success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 dark:bg-success-500 dark:hover:bg-success-600 dark:active:bg-success-700',
        accent: 'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 dark:bg-accent-500 dark:hover:bg-accent-600 dark:active:bg-accent-700',
        gradient: 'bg-gradient-to-r from-primary-600 to-primary-800 text-white hover:from-primary-700 hover:to-primary-900 dark:from-primary-500 dark:to-primary-700 dark:hover:from-primary-600 dark:hover:to-primary-800 shadow-lg hover:shadow-xl',
        glass: 'bg-white/80 backdrop-blur-sm border border-white/20 text-gray-900 hover:bg-white/90 dark:bg-neutral-800/80 dark:border-neutral-700/20 dark:text-neutral-100 dark:hover:bg-neutral-800/90',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
        xl: 'h-14 px-8 text-lg',
      },
      animation: {
        none: '',
        bounce: 'hover:animate-bounce',
        pulse: 'hover:animate-pulse',
        wiggle: 'hover:animate-wiggle',
        glow: 'hover:animate-glow',
        scale: 'hover:scale-105 active:scale-95',
        float: 'hover:animate-float',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'scale',
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation, 
    asChild = false, 
    loading = false,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    const buttonContent = (
      <>
        {loading && (
          <motion.div
            className="mr-2 h-4 w-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          </motion.div>
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    )

    if (animation === 'glow' || animation === 'float') {
      return (
        <motion.button
          className={cn(enhancedButtonVariants({ variant, size, animation: 'none', className }))}
          ref={ref}
          disabled={isDisabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          {...props}
        >
          {buttonContent}
        </motion.button>
      )
    }

    return (
      <button
        className={cn(enhancedButtonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)

EnhancedButton.displayName = 'EnhancedButton'

export { EnhancedButton, enhancedButtonVariants }
