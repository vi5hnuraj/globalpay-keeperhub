// client/src/config/chains.js
// Active chain: Base Sepolia (KeeperHub rail, USDC ERC20 settlement).
// Values come from client/.env (VITE_CHAIN_*), with safe defaults here.

const chainId = Number(import.meta.env.VITE_CHAIN_ID || 84532);
const rpcUrl = import.meta.env.VITE_RPC_URL || "https://sepolia.base.org";
const chainName = import.meta.env.VITE_CHAIN_NAME || "Base Sepolia";
const explorerUrl = import.meta.env.VITE_EXPLORER_URL || "https://sepolia.basescan.org/";
const symbol = import.meta.env.VITE_CHAIN_SYMBOL || "ETH";

export const activeChain = {
  chainId: chainId,
  rpc: [rpcUrl],
  nativeCurrency: {
    decimals: 18,
    name: symbol === "ETH" ? "Ether" : symbol,
    symbol: symbol,
  },
  shortName: "base-sepolia",
  slug: "base-sepolia",
  testnet: true,
  chain: chainName,
  name: chainName,
  explorers: [
    {
      name: `BaseScan Explorer`,
      url: explorerUrl,
      standard: "EIP309"
    }
  ]
};
