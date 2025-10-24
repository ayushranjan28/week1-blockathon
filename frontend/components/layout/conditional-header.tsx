'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'

export function ConditionalHeader() {
  const pathname = usePathname()
  
  // Don't show header on landing page since it has its own
  if (pathname === '/') {
    return null
  }
  
  return <Header />
}
