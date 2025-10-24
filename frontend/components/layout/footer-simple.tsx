import Link from 'next/link'
import { Github, Twitter, MessageCircle, Mail, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

const footerLinks = {
  Product: [
    { name: 'Features', href: '/features' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Roadmap', href: '/roadmap' },
  ],
  Governance: [
    { name: 'Proposals', href: '/proposals' },
    { name: 'Voting', href: '/voting' },
    { name: 'Treasury', href: '/treasury' },
    { name: 'Analytics', href: '/analytics' },
  ],
  Community: [
    { name: 'Discord', href: 'https://discord.gg/civicdao' },
    { name: 'Twitter', href: 'https://twitter.com/civicdao' },
    { name: 'GitHub', href: 'https://github.com/civicdao' },
    { name: 'Blog', href: '/blog' },
  ],
  Support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Documentation', href: '/docs' },
    { name: 'Contact', href: '/contact' },
    { name: 'Status', href: '/status' },
  ],
}

export function FooterSimple() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold">Civic DAO</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Transparent city governance through decentralized voting and 
              community-driven decision making.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Civic DAO. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <Button
        onClick={scrollToTop}
        variant="ghost"
        size="sm"
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full w-12 h-12 shadow-lg"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  )
}
