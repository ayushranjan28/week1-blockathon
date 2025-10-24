'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  center?: boolean
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full'
}

const paddingClasses = {
  none: '',
  sm: 'px-4 py-2',
  md: 'px-6 py-4',
  lg: 'px-8 py-6',
  xl: 'px-12 py-8'
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = 'full',
  padding = 'md',
  center = true
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8'
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gridCols = [
    `grid-cols-${cols.default || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cn(
        'grid',
        gridCols,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  size?: {
    default?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
    sm?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
    md?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
    lg?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  }
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'default'
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl'
}

const weightClasses = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
}

const colorClasses = {
  primary: 'text-primary-600 dark:text-primary-400',
  secondary: 'text-secondary-600 dark:text-secondary-400',
  accent: 'text-accent-600 dark:text-accent-400',
  muted: 'text-gray-500 dark:text-neutral-400',
  default: 'text-gray-900 dark:text-neutral-100'
}

export function ResponsiveText({
  children,
  className,
  size = { default: 'base', sm: 'lg', md: 'xl', lg: '2xl' },
  weight = 'normal',
  color = 'default'
}: ResponsiveTextProps) {
  const sizeClass = [
    size.default && sizeClasses[size.default],
    size.sm && `sm:${sizeClasses[size.sm]}`,
    size.md && `md:${sizeClasses[size.md]}`,
    size.lg && `lg:${sizeClasses[size.lg]}`
  ].filter(Boolean).join(' ')

  return (
    <span
      className={cn(
        sizeClass,
        weightClasses[weight],
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  )
}
