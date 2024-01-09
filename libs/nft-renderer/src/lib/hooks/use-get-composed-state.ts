import { Address, Chain, useContractRead } from 'wagmi';
import { useGetTokenPrimaryAsset } from './use-get-token-primary-asset';
import { EVM_RMRK_CONTRACTS } from '../rmrk-contract-addresses';
import { RMRKEquipRenderUtils } from '../../abi/RMRKEquipRenderUtils';
import { mapChainIdToNetwork } from '../chain-mapping';
import { useFetchMetadataAndAddToEntities } from './use-fetch-metadata-and-add-to-entities';

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
  const network = mapChainIdToNetwork(chainId);
  const { enabled = true, enabledMetadataFetch = true } = options || {};

  const {
    primaryAsset,
    error: errorPrimaryAsset,
    isError: isErrorPrimaryAsset,
    isLoading: isLoadingPrimaryAsset,
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

  console.log({
    contractAddress,
    tokenId,
    assetIdToUse,
    chainId,
  });

  const {
    data: equippableDataResponse,
    isLoading: isLoadingEquippableData,
    isError: isErrorEquippableData,
    error: errorEquippableData,
    refetch: refetchEquippableData,
  } = useContractRead({
    address: EVM_RMRK_CONTRACTS[network].renderUtil,
    abi: RMRKEquipRenderUtils,
    chainId,
    functionName: 'composeEquippables',
    args: [contractAddress, tokenId, assetIdToUse || BigInt(0)],
    enabled: enabled && !!assetIdToUse,
  });

  console.log('supportsMultiAssetInterface', {
    supportsMultiAssetInterface,
    assetIdToUse,
    equippableDataResponse,
    errorEquippableData,
  });

  const [assetMetadataUri, equippableGroupId, catalogAddress, fixedParts, slotParts] =
    equippableDataResponse || [];

  console.log('fixedParts', {
    fixedParts,
    slotParts,
  });

  const {
    isLoading: isLoadingFixedPartsMetadatas,
    isError: isErrorFixedPartsMetadatas,
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
    data: slotPartsWithMetadatas,
  } = useFetchMetadataAndAddToEntities(
    {
      metadataUris: slotParts?.map((p) => p.childAssetMetadata || p.partMetadata),
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
    refetch: refetchEquippableData || refetchPrimaryAsset,
    error: errorEquippableData || errorPrimaryAsset,
  };
};
