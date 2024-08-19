import { RMRKCollectionUtils } from '@rmrk-team/rmrk-evm-utils';
import type { Chain } from 'viem';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { useRMRKConfig } from '../RMRKContext.js';

type Arguments = {
  contractAddress: Address;
  chainId: Chain['id'];
};

type Options = {
  enabled?: boolean;
};

const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Retrieves interface support information for a given contract address and chain ID.
 *
 * @param {Arguments} args - The arguments object containing the contract address and chain ID.
 * @param {Options} [options] - The options object containing additional configuration.
 */
export const useGetInterfaceSupport = (args: Arguments, options?: Options) => {
  const { contractAddress, chainId } = args;
  const { enabled = true } = options || {};
  const config = useRMRKConfig();

  const { data, ...reactQueryReturnProps } = useReadContract({
    address: config.utilityContracts[chainId]?.RMRKCollectionUtils,
    abi: RMRKCollectionUtils,
    functionName: 'getInterfaceSupport',
    chainId,
    args: [contractAddress],
    query: {
      enabled: enabled && !!contractAddress,
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: ONE_DAY,
    },
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
    ...reactQueryReturnProps,
  };
};
