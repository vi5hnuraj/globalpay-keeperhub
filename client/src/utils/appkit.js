import { createAppKit } from '@reown/appkit/react';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { defineChain } from '@reown/appkit/networks';

// Primary network: Base Sepolia — the chain GlobalPay settles on through
// KeeperHub (USDC ERC20 + native gas).
export const baseSepolia = defineChain({
  id: 84532,
  caipNetworkId: 'eip155:84532',
  chainNamespace: 'eip155',
  name: 'Base Sepolia',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL || 'https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: import.meta.env.VITE_EXPLORER_URL || 'https://sepolia.basescan.org' },
  },
  testnet: true,
});

export const appkit = createAppKit({
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '8fe9b4cfa486d6e1632640d06975e3b7',
  adapters: [new Ethers5Adapter()],
  networks: [baseSepolia],
  metadata: {
    name: 'GlobalPay — Agent Commerce on Base, Settled via KeeperHub',
    description: 'Autonomous AI agents pay in USDC with Trust-Engine-verified settlement executed through KeeperHub',
    url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
    icons: []
  },
  features: { analytics: false },
  themeMode: 'dark',
  themeVariables: { '--w3m-accent': '#06b6d4' }
});
