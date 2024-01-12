import type { Address, Chain } from 'viem';
import { useReadContract } from 'wagmi';
import { mapChainIdToNetwork, RMRKEquippableImpl } from '@rmrk-team/rmrk-evm-utils';
import { useGetInterfaceSupport } from './use-get-interface-support.js';
import type { RMRKAssetExtended } from '@rmrk-team/types';

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

export const useGetTokenAssetById = (
  args: Arguments,
  options?: Options,
): {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
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
    supportsEquippableInterface === undefined || supportsMultiAssetInterface === undefined;

  const network = mapChainIdToNetwork(chainId);

  const {
    isLoading: isLoadingGetInterfaceSupport,
    interfaceSupport: { supportsEquippable, supportsMultiAsset, supportsNesting },
  } = useGetInterfaceSupport(
    { contractAddress, chainId },
    { enabled: enabled && requiresInterfaceCheck },
  );

  const enabledSimplePrimaryAsset = enabled && supportsMultiAsset && !supportsEquippable;
  const enabledAssetWithEquippableData = enabled && supportsEquippable;

  const {
    data: assetMetadataUri,
    isLoading: isLoadingAssetMetadataUri,
    error: errorAssetMetadataUri,
    refetch: refetAssetMetadataUri,
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

  const assetWithEquippableData: RMRKAssetExtended | undefined = assetAndEquippableDataForToken
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
    refetch: refetchAssetAndEquippableDataForToken || refetAssetMetadataUri,
    assetById: assetSimple || assetWithEquippableData,
  };
};