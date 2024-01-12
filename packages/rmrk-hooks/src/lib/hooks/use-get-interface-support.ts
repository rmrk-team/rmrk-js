import type { Chain } from 'viem';
import { useReadContract } from 'wagmi';
import type { Address } from 'viem';
import {
  EVM_RMRK_CONTRACTS,
  mapChainIdToNetwork,
  RMRKCollectionUtils,
} from '@rmrk-team/rmrk-evm-utils';

type Arguments = {
  contractAddress: Address;
  chainId: Chain['id'];
};

type Options = {
  enabled?: boolean;
};

const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Used to get extended information about a specified collection.
 */
export const useGetInterfaceSupport = (args: Arguments, options?: Options) => {
  const { contractAddress, chainId } = args;
  const { enabled = true } = options || {};
  const network = mapChainIdToNetwork(chainId);

  const { data, isLoading, error, refetch } = useReadContract({
    address: EVM_RMRK_CONTRACTS[network]['RMRKCollectionUtils'],
    abi: RMRKCollectionUtils,
    functionName: 'getInterfaceSupport',
    chainId,
    args: [contractAddress],
    // query: { enabled: enabled && !!contractAddress, staleTime: Infinity, cacheTime: ONE_DAY },
    query: { enabled: enabled && !!contractAddress },
  });

  const [
    supports721,
    supportsMultiAsset,
    supportsNesting,
    supportsEquippable,
    supportsSoulbound,
    supportsRoyalties,
  ] = data || [];

  const interfaceSupport = {
    supportsSoulbound,
    supportsNesting,
    supportsEquippable,
    supportsRoyalties,
    supportsMultiAsset,
    supports721,
  } as const;

  return {
    interfaceSupport,
    isLoading,
    error,
    refetch,
  };
};
