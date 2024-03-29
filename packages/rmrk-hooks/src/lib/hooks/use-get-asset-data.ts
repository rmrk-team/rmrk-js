import type { Address, Chain } from 'viem';
import { useFetchMetadataAndAddToEntity } from './use-fetch-metadata-and-add-to-entity.js';
import { useGetInterfaceSupport } from './use-get-interface-support.js';
import { useGetTokenAssetById } from './use-get-token-asset-by-id.js';
import { useGetTokenPrimaryAsset } from './use-get-token-primary-asset.js';

type Arguments = {
  assetId?: bigint;
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
 * Retrieves asset data based on the provided arguments and options.
 *
 * @param {Arguments} args - The arguments for retrieving asset data.
 * @param {Options} [options] - The options for retrieving asset data.
 */
export const useGetAssetData = (args: Arguments, options?: Options) => {
  const {
    contractAddress,
    tokenId,
    assetId,
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
    isError: isErrorGetInterfaceSupport,
    error: errorGetInterfaceSupport,
    isFetching: isFetchingGetInterfaceSupport,
    interfaceSupport: { supportsEquippable, supportsMultiAsset },
    refetch: refetchGetInterfaceSupport,
  } = useGetInterfaceSupport(
    { contractAddress, chainId },
    { enabled: requiresInterfaceCheck },
  );

  const {
    primaryAsset,
    isLoading: isLoadingPrimaryAsset,
    isError: isErrorPrimaryAsset,
    isFetching: isFetchingPrimaryAsset,
    error: errorPrimaryAsset,
    refetch: refetchPrimaryAsset,
  } = useGetTokenPrimaryAsset(
    {
      contractAddress,
      tokenId,
      chainId,
      supportsEquippableInterface: supportsEquippable,
      supportsMultiAssetInterface: supportsMultiAsset,
    },
    { enabled: enabled && !assetId && supportsMultiAsset === true },
  );

  const {
    assetById,
    isLoading: isLoadingAssetById,
    isFetching: isFetchingAssetById,
    isError: isErrorAssetById,
    error: errorAssetById,
    refetch: refetchAssetById,
  } = useGetTokenAssetById(
    {
      assetId: assetId || BigInt(0),
      contractAddress,
      tokenId,
      chainId,
      supportsEquippableInterface: supportsEquippable,
      supportsMultiAssetInterface: supportsMultiAsset,
    },
    { enabled: enabled && !!assetId && supportsMultiAsset },
  );

  const assetData = primaryAsset || assetById;

  const {
    data: asset,
    isLoading: isLoadingIpfsMetadata,
    error: errorIpfsMetadata,
    isError: isErrorIpfsMetadata,
    refetch: refetchIpfsMetadata,
    isFetching: isFetchingIpfsMetadata,
  } = useFetchMetadataAndAddToEntity(
    { metadataUri: assetData?.metadataUri },
    { enabled: !!assetData?.metadataUri },
    assetData,
  );

  return {
    isLoading:
      isLoadingAssetById ||
      isLoadingPrimaryAsset ||
      isLoadingGetInterfaceSupport ||
      isLoadingIpfsMetadata,
    isFetching:
      isFetchingAssetById ||
      isFetchingPrimaryAsset ||
      isFetchingGetInterfaceSupport ||
      isFetchingIpfsMetadata,
    isError:
      isErrorPrimaryAsset ||
      isErrorAssetById ||
      isErrorIpfsMetadata ||
      isErrorGetInterfaceSupport,
    error:
      errorAssetById ||
      errorPrimaryAsset ||
      errorIpfsMetadata ||
      errorGetInterfaceSupport,
    refetch: refetchPrimaryAsset || refetchAssetById,
    asset,
  };
};
