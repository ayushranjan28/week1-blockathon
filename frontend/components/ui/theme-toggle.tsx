'use client'

import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from './button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const

  return (
    <div className="flex items-center bg-secondary-100 rounded-lg p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={theme === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme(value as 'light' | 'dark' | 'system')}
          className={`flex items-center gap-2 ${
            theme === value 
              ? 'bg-primary-600 text-white shadow-sm' 
              : 'text-secondary-600 hover:text-secondary-900'
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  )
}

export function ThemeToggleSimple() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      className="text-secondary-600 hover:text-secondary-900"
    >
      {resolvedTheme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
}
