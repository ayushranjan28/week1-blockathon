'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Users, Vote, Zap, Globe, Lock, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const features = [
  {
    icon: Vote,
    title: 'Transparent Voting',
    description: 'Every decision is recorded on-chain with complete transparency and immutability.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Shield,
    title: 'Privacy Protection',
    description: 'ZK-proof identity verification ensures privacy while maintaining security.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Decentralized governance puts power back in the hands of citizens.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track participation, voting trends, and governance metrics in real-time.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Lock,
    title: 'Secure & Auditable',
    description: 'Built on proven smart contracts with comprehensive security audits.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Participate in governance from anywhere in the world, 24/7.',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
]

const stats = [
  { label: 'Active Proposals', value: '12', change: '+3 this week' },
  { label: 'Community Members', value: '2.4K', change: '+15% this month' },
  { label: 'Total Votes Cast', value: '8.7K', change: '+22% this month' },
  { label: 'Budget Allocated', value: '$1.2M', change: '+8% this month' },
]

const timeline = [
  {
    step: '1',
    title: 'Connect Wallet',
    description: 'Securely connect your wallet to participate in governance.',
    icon: Lock,
  },
  {
    step: '2',
    title: 'Verify Identity',
    description: 'Complete ZK-proof identity verification for privacy and security.',
    icon: Shield,
  },
  {
    step: '3',
    title: 'Create or Vote',
    description: 'Submit proposals or vote on existing community initiatives.',
    icon: Vote,
  },
  {
    step: '4',
    title: 'Track Progress',
    description: 'Monitor proposal execution and community impact in real-time.',
    icon: BarChart3,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 transition-colors">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-neutral-100 mb-6">
                Transparent{' '}
                <span className="gradient-text">City Governance</span>
                <br />
                for the Digital Age
              </h1>
              <p className="text-xl text-gray-600 dark:text-neutral-300 max-w-3xl mx-auto mb-8 text-balance">
                Join the future of civic participation. Vote on city initiatives, 
                propose solutions, and shape your community through decentralized, 
                transparent governance powered by blockchain technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" className="btn-primary btn-lg">
                Join DAO Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="btn-outline btn-lg">
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-success-200 rounded-full opacity-25 animate-float" style={{ animationDelay: '4s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-neutral-800 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-neutral-400 mb-1">{stat.label}</div>
                <div className="text-xs text-success-600 dark:text-success-400">{stat.change}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-neutral-900 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-4">
              Why Choose Civic DAO?
            </h2>
            <p className="text-xl text-gray-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Experience the future of governance with cutting-edge technology 
              and user-friendly design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-neutral-300">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-neutral-800 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Get started with civic governance in just a few simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                {index < timeline.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 transform translate-x-1/2"></div>
                )}
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-neutral-300 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Shape Your City's Future?
            </h2>
            <p className="text-xl text-primary-100 dark:text-primary-200 max-w-2xl mx-auto mb-8">
              Join thousands of citizens already participating in transparent, 
              democratic governance. Your voice matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="btn-secondary btn-lg">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
                View Proposals
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
