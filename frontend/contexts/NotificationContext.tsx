'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: number
  read: boolean
  actionUrl?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false
    }

    setNotifications(prev => [newNotification, ...prev])

    // Show toast notification
    const toastOptions = {
      duration: notification.type === 'error' ? 5000 : 4000,
    }

    switch (notification.type) {
      case 'success':
        toast.success(notification.message, toastOptions)
        break
      case 'error':
        toast.error(notification.message, toastOptions)
        break
      case 'warning':
        toast(notification.message, { ...toastOptions, icon: '⚠️' })
        break
      case 'info':
        toast(notification.message, { ...toastOptions, icon: 'ℹ️' })
        break
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random governance notifications
      const notificationTypes = [
        {
          type: 'info' as const,
          title: 'New Proposal',
          message: 'A new proposal has been submitted for community voting'
        },
        {
          type: 'warning' as const,
          title: 'Voting Deadline',
          message: 'A proposal you\'re following is ending soon'
        },
        {
          type: 'success' as const,
          title: 'Proposal Executed',
          message: 'A proposal you voted for has been successfully executed'
        }
      ]

      if (Math.random() < 0.1) { // 10% chance every interval
        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
        addNotification(randomNotification)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
