// import { WALLET_CONNECT_PROJECT_ID } from './consts.js';
// import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import type { Transport } from 'viem';
import { http, createConfig } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import {
  astar,
  base,
  baseSepolia,
  hardhat,
  mainnet,
  moonbaseAlpha,
  moonbeam,
  polygon,
  polygonMumbai,
  sepolia,
} from 'wagmi/chains';

const productionChains = [moonbeam, mainnet, polygon, base, astar] as const;
const testnetChains = [
  moonbaseAlpha,
  moonbeam,
  sepolia,
  mainnet,
  polygonMumbai,
  baseSepolia,
  hardhat,
] as const;
export const allSupportedChains: readonly [Chain, ...Chain[]] = [
  ...productionChains,
  ...testnetChains,
];

// const {
//   chains: wagmiChains,
//   publicClient,
//   webSocketPublicClient,
// } = configureChains({chains: allSupportedChains, transports: []}});

export const chains = allSupportedChains;

// const { connectors } = getDefaultWallets({
//   appName: 'Lightm RMRK composable NFT renderer',
//   projectId: WALLET_CONNECT_PROJECT_ID,
//   chains,
// });

const transports: Record<number, Transport> = {};

for (const chain of productionChains) {
  transports[chain.id] = http();
}

export const wagmiConfig = createConfig({
  ssr: true,
  chains,
  transports,
});
