import { RMRKEquipRenderUtils } from '@rmrk-team/rmrk-evm-utils';
import type { RMRKAssetExtended } from '@rmrk-team/types';
import type { Address, Chain } from 'viem';
import { useReadContract } from 'wagmi';
import { useRMRKConfig } from '../RMRKContext.js';
import { useGetInterfaceSupport } from './use-get-interface-support.js';

type Arguments = {
  tokenId: bigint;
  contractAddress: Address;
  chainId: Chain['id'];
  supportsEquippableInterface?: boolean;
  supportsMultiAssetInterface?: boolean;
};

type Options = {
  enabled?: boolean;
  enabledMetadataFetch?: boolean;
};

/**
 * Retrieves the primary asset for a given token using various parameters.
 *
 * @param {Arguments} args - The arguments for retrieving the primary asset.
 * @param {Options} [options] - The options for customizing the retrieval.
 * @returns {{
 *   isLoading: boolean;
 *   isFetching: boolean;
 *   isError: boolean;
 *   error: Error | null;
 *   refetch: () => void;
 *   primaryAsset: RMRKAssetExtended | undefined;
 * }}
 */
export const useGetTokenPrimaryAsset = (
  args: Arguments,
  options?: Options,
): {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  primaryAsset: RMRKAssetExtended | undefined;
} => {
  const config = useRMRKConfig();
  const {
    contractAddress,
    tokenId,
    chainId,
    supportsEquippableInterface,
    supportsMultiAssetInterface,
  } = args;
  const { enabled = true, enabledMetadataFetch = true } = options || {};

  const requiresInterfaceCheck =
    supportsEquippableInterface === undefined ||
    supportsMultiAssetInterface === undefined;

  const {
    isLoading: isLoadingGetInterfaceSupport,
    interfaceSupport: { supportsEquippable, supportsMultiAsset },
    isFetching: isFetchingGetInterfaceSupport,
    error: errorGetInterfaceSupport,
    isError: isErrorGetInterfaceSupport,
  } = useGetInterfaceSupport(
    { contractAddress, chainId },
    { enabled: enabled && requiresInterfaceCheck },
  );

  const enabledSimplePrimaryAsset =
    enabled && supportsMultiAsset && !supportsEquippable;
  const enabledAssetWithEquippableData = enabled && supportsEquippable;

  const {
    data: topAssetForToken,
    isLoading: loadingTopAssetForToken,
    error: errorTopAsseForToken,
    isError: isErrorTopAsseForToken,
    isFetching: isFetchingTopAsseForToken,
    refetch: refetTopAssetForToken,
  } = useReadContract({
    address: enabledSimplePrimaryAsset
      ? config.utilityContracts[chainId]?.RMRKEquipRenderUtils
      : undefined,
    abi: RMRKEquipRenderUtils,
    functionName: 'getTopAsset',
    chainId,
    args: [contractAddress, tokenId],
    query: { enabled: enabledSimplePrimaryAsset },
  });

  const {
    data: topAssetAndEquippableDataForToken,
    isLoading: loadingTopAssetAndEquippableDataForToken,
    isError: isErrorTopAssetAndEquippableDataForToken,
    isFetching: isFetchingTopAssetAndEquippableDataForToken,
    error: errorTopAssetAndEquippableDataForToken,
    refetch: refetchTopAssetAndEquippableDataForToken,
  } = useReadContract({
    address: enabledAssetWithEquippableData
      ? config.utilityContracts[chainId]?.RMRKEquipRenderUtils
      : undefined,
    abi: RMRKEquipRenderUtils,
    functionName: 'getTopAssetAndEquippableDataForToken',
    chainId,
    args: [contractAddress, tokenId],
    query: { enabled: enabledAssetWithEquippableData },
  });

  const primaryAssetWithEquippableData = topAssetAndEquippableDataForToken
    ? ({
        id: topAssetAndEquippableDataForToken.id,
        partIds: [...topAssetAndEquippableDataForToken.partIds],
        metadataUri: topAssetAndEquippableDataForToken.metadata,
        equippableGroupId: topAssetAndEquippableDataForToken.equippableGroupId,
        catalogAddress: topAssetAndEquippableDataForToken.catalogAddress,
      } satisfies RMRKAssetExtended)
    : undefined;

  const primaryAssetSimple = topAssetForToken
    ? ({
        id: topAssetForToken[0],
        metadataUri: topAssetForToken[2],
      } satisfies RMRKAssetExtended)
    : undefined;

  return {
    isLoading:
      isLoadingGetInterfaceSupport ||
      loadingTopAssetForToken ||
      loadingTopAssetAndEquippableDataForToken,
    isFetching:
      isFetchingGetInterfaceSupport ||
      isFetchingTopAsseForToken ||
      isFetchingTopAssetAndEquippableDataForToken,
    isError:
      isErrorGetInterfaceSupport ||
      isErrorTopAsseForToken ||
      isErrorTopAssetAndEquippableDataForToken,
    error:
      errorTopAsseForToken ||
      errorTopAssetAndEquippableDataForToken ||
      errorGetInterfaceSupport,
    refetch: refetchTopAssetAndEquippableDataForToken || refetTopAssetForToken,
    primaryAsset: primaryAssetSimple || primaryAssetWithEquippableData,
  };
};
