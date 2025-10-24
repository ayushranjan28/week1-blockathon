import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import { ConditionalHeader } from '@/components/layout/conditional-header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Civic DAO - Transparent City Governance',
  description: 'A decentralized autonomous organization platform for transparent city governance, enabling community-driven decision-making through on-chain voting and privacy-preserving identity verification.',
  keywords: ['DAO', 'governance', 'blockchain', 'civic', 'voting', 'transparency', 'democracy'],
  authors: [{ name: 'Civic DAO Team' }],
  creator: 'Civic DAO',
  publisher: 'Civic DAO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://civic-dao.vercel.app'),
  openGraph: {
    title: 'Civic DAO - Transparent City Governance',
    description: 'A decentralized autonomous organization platform for transparent city governance',
    url: 'https://civic-dao.vercel.app',
    siteName: 'Civic DAO',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Civic DAO - Transparent City Governance',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civic DAO - Transparent City Governance',
    description: 'A decentralized autonomous organization platform for transparent city governance',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <ConditionalHeader />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
