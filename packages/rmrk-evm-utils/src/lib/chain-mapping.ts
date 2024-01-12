import type { Chain } from 'wagmi';
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

export const EVM_NETWORKS = {
  moonbeam: 'moonbeam',
  moonbaseAlpha: 'moonbase-alpha',
  ethereum: 'ethereum',
  sepolia: 'sepolia',
  polygon: 'polygon',
  polygonMumbai: 'maticmum',
  base: 'base',
  baseSepolia: 'base-sepolia',
  astar: 'astar',
  hardhat: 'hardhat',
} as const;

export type EVM_NETWORKS = (typeof EVM_NETWORKS)[keyof typeof EVM_NETWORKS];

export const mapEvmNetworkToSupportedChain = (network: EVM_NETWORKS): Chain => {
  switch (network) {
    case EVM_NETWORKS.moonbeam:
      return moonbeam;
    case EVM_NETWORKS.moonbaseAlpha:
      return moonbaseAlpha;
    case EVM_NETWORKS.ethereum:
      return mainnet;
    case EVM_NETWORKS.polygon:
      return polygon;
    case EVM_NETWORKS.polygonMumbai:
      return polygonMumbai;
    case EVM_NETWORKS.sepolia:
      return sepolia;
    case EVM_NETWORKS.base:
      return base;
    case EVM_NETWORKS.baseSepolia:
      return baseSepolia;
    case EVM_NETWORKS.astar:
      return astar;
    case EVM_NETWORKS.hardhat:
      return hardhat;
  }
};

export const mapChainIdToNetwork = (chainId: Chain['id']): EVM_NETWORKS => {
  switch (chainId) {
    case moonbeam.id:
      return EVM_NETWORKS.moonbeam;
    case moonbaseAlpha.id:
      return EVM_NETWORKS.moonbaseAlpha;
    case mainnet.id:
      return EVM_NETWORKS.ethereum;
    case polygon.id:
      return EVM_NETWORKS.polygon;
    case polygonMumbai.id:
      return EVM_NETWORKS.polygonMumbai;
    case sepolia.id:
      return EVM_NETWORKS.sepolia;
    case base.id:
      return EVM_NETWORKS.base;
    case baseSepolia.id:
      return EVM_NETWORKS.baseSepolia;
    case astar.id:
      return EVM_NETWORKS.astar;
    case hardhat.id:
      return EVM_NETWORKS.hardhat;
    default:
      throw new Error(`Chain with id ${chainId} is not supported`);
  }
};
