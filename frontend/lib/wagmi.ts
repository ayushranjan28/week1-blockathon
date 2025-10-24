import { createConfig, http } from 'wagmi'
import { mainnet, polygon, polygonAmoy, sepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  CIVIC_TOKEN: process.env.NEXT_PUBLIC_CIVIC_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  CIVIC_DAO: process.env.NEXT_PUBLIC_CIVIC_DAO_ADDRESS || '0x0000000000000000000000000000000000000000',
  TIMELOCK: process.env.NEXT_PUBLIC_TIMELOCK_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const

// Supported chains
export const SUPPORTED_CHAINS = [polygonAmoy, sepolia, polygon, mainnet] as const

// RPC URLs
const RPC_URLS = {
  [polygonAmoy.id]: 'https://rpc-amoy.polygon.technology',
  [sepolia.id]: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  [polygon.id]: 'https://polygon-rpc.com',
  [mainnet.id]: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
}

// Create wagmi config
export const config = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
    }),
    coinbaseWallet({
      appName: 'Civic DAO',
      appLogoUrl: 'https://civic-dao.vercel.app/logo.png',
    }),
  ],
  transports: {
    [polygonAmoy.id]: http(RPC_URLS[polygonAmoy.id]),
    [sepolia.id]: http(RPC_URLS[sepolia.id]),
    [polygon.id]: http(RPC_URLS[polygon.id]),
    [mainnet.id]: http(RPC_URLS[mainnet.id]),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
