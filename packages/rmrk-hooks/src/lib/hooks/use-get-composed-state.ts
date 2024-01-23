import { RMRKEquipRenderUtils } from '@rmrk-team/rmrk-evm-utils';
import type { Address, Chain } from 'viem';
import { useReadContract } from 'wagmi';
import { useRMRKConfig } from '../RMRKContextProvider.js';
import { useFetchMetadataAndAddToEntities } from './use-fetch-metadata-and-add-to-entities.js';
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

export const useGetComposedState = (
  {
    contractAddress,
    supportsEquippableInterface,
    supportsMultiAssetInterface,
    assetId,
    chainId,
    tokenId,
  }: Arguments,
  options?: Options,
) => {
  const { enabled = true, enabledMetadataFetch = true } = options || {};
  const config = useRMRKConfig();

  const {
    primaryAsset,
    error: errorPrimaryAsset,
    isError: isErrorPrimaryAsset,
    isLoading: isLoadingPrimaryAsset,
    isFetching: isFetchingPrimaryAsset,
    refetch: refetchPrimaryAsset,
  } = useGetTokenPrimaryAsset(
    {
      contractAddress,
      tokenId,
      chainId,
      supportsEquippableInterface,
      supportsMultiAssetInterface,
    },
    { enabled: enabled && !assetId && supportsMultiAssetInterface === true },
  );

  const assetIdToUse = assetId || primaryAsset?.id;

  const {
    data: equippableDataResponse,
    isLoading: isLoadingEquippableData,
    isError: isErrorEquippableData,
    isFetching: isFetchingEquippableData,
    error: errorEquippableData,
    refetch: refetchEquippableData,
  } = useReadContract({
    address: config.utilityContracts[chainId]?.RMRKEquipRenderUtils,
    abi: RMRKEquipRenderUtils,
    chainId,
    functionName: 'composeEquippables',
    args: [contractAddress, tokenId, assetIdToUse || BigInt(0)],
    query: { enabled: enabled && !!assetIdToUse },
  });

  const [
    assetMetadataUri,
    equippableGroupId,
    catalogAddress,
    fixedParts,
    slotParts,
  ] = equippableDataResponse || [];

  const {
    isLoading: isLoadingFixedPartsMetadatas,
    isError: isErrorFixedPartsMetadatas,
    isFetching: isFetchingFixedPartsMetadatas,
    data: fixedPartsWithMetadatas,
  } = useFetchMetadataAndAddToEntities(
    {
      metadataUris: fixedParts?.map((p) => p.metadataURI),
    },
    { enabled: enabled && enabledMetadataFetch },
    fixedParts?.map((p) => ({ z: p.z })),
  );

  const {
    isLoading: isLoadingSlotPartsMetadatas,
    isError: isErrorSlotPartsMetadatas,
    isFetching: isFetchingSlotPartsMetadatas,
    data: slotPartsWithMetadatas,
  } = useFetchMetadataAndAddToEntities(
    {
      metadataUris: slotParts?.map(
        (p) => p.childAssetMetadata || p.partMetadata,
      ),
    },
    { enabled: enabled && enabledMetadataFetch },
    slotParts?.map((p) => ({ z: p.z })),
  );

  return {
    data: {
      fixedPartsWithMetadatas,
      slotPartsWithMetadatas,
      assetMetadataUri,
      equippableGroupId,
      catalogAddress,
    },
    isLoading:
      isLoadingPrimaryAsset ||
      isLoadingEquippableData ||
      isLoadingSlotPartsMetadatas ||
      isLoadingFixedPartsMetadatas,
    isError:
      isErrorEquippableData ||
      isErrorPrimaryAsset ||
      isErrorFixedPartsMetadatas ||
      isErrorSlotPartsMetadatas,
    isFetching:
      isFetchingEquippableData ||
      isFetchingPrimaryAsset ||
      isFetchingFixedPartsMetadatas ||
      isFetchingSlotPartsMetadatas,
    refetch: refetchEquippableData || refetchPrimaryAsset,
    error: errorEquippableData || errorPrimaryAsset,
  };
};
