import { RMRKEquippableImpl } from '@rmrk-team/rmrk-evm-utils';
import type { RMRKAssetExtended } from '@rmrk-team/types';
import type { Address, Chain } from 'viem';
import { useReadContract } from 'wagmi';
import { useGetInterfaceSupport } from './use-get-interface-support.js';

type Arguments = {
  tokenId: bigint;
  assetId: bigint;
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
 * Retrieves token asset by its ID.
 *
 * @param {Arguments} args - The arguments required to retrieve the token asset.
 * @param {Options} [options] - The options for retrieving the token asset.
 * @returns {{
 *   isLoading: boolean;
 *   isError: boolean;
 *   error: Error | null;
 *   isFetching: boolean;
 *   refetch: () => void;
 *   assetById: RMRKAssetExtended | undefined;
 * }} The token asset object.
 */
export const useGetTokenAssetById = (
  args: Arguments,
  options?: Options,
): {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
  assetById: RMRKAssetExtended | undefined;
} => {
  const {
    contractAddress,
    assetId,
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
    isFetching: isFetchingGetInterfaceSupport,
    interfaceSupport: { supportsEquippable, supportsMultiAsset },
  } = useGetInterfaceSupport(
    { contractAddress, chainId },
    { enabled: enabled && requiresInterfaceCheck },
  );

  const enabledSimplePrimaryAsset =
    enabled && supportsMultiAsset && !supportsEquippable;
  const enabledAssetWithEquippableData = enabled && supportsEquippable;

  const {
    data: assetMetadataUri,
    isLoading: isLoadingAssetMetadataUri,
    isFetching: isFetchingAssetMetadataUri,
    error: errorAssetMetadataUri,
  } = useReadContract({
    address: enabledSimplePrimaryAsset ? contractAddress : undefined,
    abi: RMRKEquippableImpl,
    functionName: 'getAssetMetadata',
    chainId,
    args: [tokenId, assetId],
    query: { enabled: enabledSimplePrimaryAsset },
  });

  const {
    data: assetAndEquippableDataForToken,
    isLoading: isLoadingAssetAndEquippableDataForToken,
    isFetching: isFetchingAssetAndEquippableDataForToken,
    error: errorAssetAndEquippableDataForToken,
    refetch: refetchAssetAndEquippableDataForToken,
  } = useReadContract({
    address: enabledAssetWithEquippableData ? contractAddress : undefined,
    abi: RMRKEquippableImpl,
    functionName: 'getAssetAndEquippableData',
    chainId,
    args: [tokenId, assetId],
    query: { enabled: enabledAssetWithEquippableData },
  });

  const assetWithEquippableData: RMRKAssetExtended | undefined =
    assetAndEquippableDataForToken
      ? {
          id: assetId,
          metadataUri: assetAndEquippableDataForToken[0],
          equippableGroupId: assetAndEquippableDataForToken[1],
          catalogAddress: assetAndEquippableDataForToken[2],
          partIds: [...assetAndEquippableDataForToken[3]],
        }
      : undefined;

  const assetSimple: RMRKAssetExtended | undefined = assetMetadataUri
    ? {
        id: assetId,
        metadataUri: assetMetadataUri,
      }
    : undefined;

  return {
    isLoading:
      isLoadingGetInterfaceSupport ||
      isLoadingAssetAndEquippableDataForToken ||
      isLoadingAssetMetadataUri,
    isError: !!errorAssetAndEquippableDataForToken || !!errorAssetMetadataUri,
    error: errorAssetAndEquippableDataForToken || errorAssetMetadataUri,
    isFetching:
      isFetchingGetInterfaceSupport ||
      isFetchingAssetMetadataUri ||
      isFetchingAssetAndEquippableDataForToken,
    refetch: refetchAssetAndEquippableDataForToken,
    assetById: assetSimple || assetWithEquippableData,
  };
};
