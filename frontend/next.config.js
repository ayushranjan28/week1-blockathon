/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'Civic DAO',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Transparent city governance through decentralized voting',
  },
}

module.exports = nextConfig
