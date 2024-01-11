import { Chain, configureChains, createConfig } from 'wagmi';
import {
  mainnet,
  moonbaseAlpha,
  moonbeam,
  sepolia,
  polygonMumbai,
  polygon,
  baseSepolia,
  astar,
  base,
  hardhat,
} from '@wagmi/core/chains';
import { publicProvider } from 'wagmi/providers/public';
import { WALLET_CONNECT_PROJECT_ID } from './consts';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

const productionChains = [moonbeam, mainnet, polygon, base, astar];
const testnetChains = [
  moonbaseAlpha,
  moonbeam,
  sepolia,
  mainnet,
  polygonMumbai,
  baseSepolia,
  hardhat,
];
export const allSupportedChains: Chain[] = [...productionChains, ...testnetChains];

const {
  chains: wagmiChains,
  publicClient,
  webSocketPublicClient,
} = configureChains(allSupportedChains, [publicProvider()]);

export const chains = wagmiChains;

const { connectors } = getDefaultWallets({
  appName: 'Lightm RMRK composable NFT renderer',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
