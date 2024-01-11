import { Address, Chain } from 'wagmi';
import { useGetInterfaceSupport } from './use-get-interface-support';
import { useGetTokenPrimaryAsset } from './use-get-token-primary-asset';
import { useGetTokenAssetById } from './use-get-token-asset-by-id';
import { useFetchMetadataAndAddToEntity } from './use-fetch-metadata-and-add-to-entity';

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
    supportsEquippableInterface === undefined || supportsMultiAssetInterface === undefined;

  const {
    isLoading: isLoadingGetInterfaceSupport,
    interfaceSupport: { supportsEquippable, supportsMultiAsset },
  } = useGetInterfaceSupport({ contractAddress, chainId }, { enabled: requiresInterfaceCheck });

  const {
    primaryAsset,
    isLoading: isLoadingPrimaryAsset,
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
    isError: !!errorAssetById || !!errorPrimaryAsset || !!errorIpfsMetadata,
    error: errorAssetById || errorPrimaryAsset || errorIpfsMetadata,
    refetch: refetchPrimaryAsset || refetchAssetById || refetchIpfsMetadata,
    asset,
  };
};
