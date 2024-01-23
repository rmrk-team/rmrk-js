import {
  RMRKEquipRenderUtils,
  RMRKEquippableImpl,
} from '@rmrk-team/rmrk-evm-utils';
import type { Address } from 'viem';
import type { Chain } from 'viem';
import { useReadContract } from 'wagmi';
import { useRMRKConfig } from '../RMRKContextProvider.js';
import { useGetInterfaceSupport } from './use-get-interface-support.js';

type Arguments = {
  tokenId: bigint;
  address: Address;
  assetId?: bigint;
  chainId: Chain['id'];
};

type Options = {
  enabled: boolean;
};

export const useGetComposableParts = (
  { tokenId, address, assetId, chainId }: Arguments,
  { enabled = true }: Options,
) => {
  const config = useRMRKConfig();
  const {
    isLoading,
    interfaceSupport: { supportsEquippable },
  } = useGetInterfaceSupport(
    { contractAddress: address, chainId },
    { enabled },
  );

  const { data: topAsset, isLoading: isGettingTopAsset } = useReadContract({
    address: config.utilityContracts[chainId]?.RMRKEquipRenderUtils,
    abi: RMRKEquipRenderUtils,
    chainId,
    functionName: 'getTopAsset',
    args: [address, tokenId],
    query: { enabled: enabled && !assetId },
  });

  const {
    data: topEquippableAssetData,
    isLoading: isLoadingRopEquippableAssetData,
    error: errorTopEquippableAssetData,
    refetch: refetchTopEquippableAssetData,
  } = useReadContract({
    address:
      enabled && !assetId
        ? config.utilityContracts[chainId]?.RMRKEquipRenderUtils
        : undefined,
    abi: RMRKEquipRenderUtils,
    chainId,
    functionName: 'getTopAssetAndEquippableDataForToken',
    args: [address, tokenId],
    query: { enabled: enabled && !assetId },
  });

  const {
    data: equippableAssetDataResponse,
    error: errorEquippableAssetData,
    isLoading: isLoadingEquippableAssetData,
    refetch: refetchEquippableAssetData,
  } = useReadContract({
    address: enabled && !!assetId ? address : undefined,
    abi: RMRKEquippableImpl,
    chainId,
    functionName: 'getAssetAndEquippableData',
    args: [tokenId, assetId || BigInt(0)],
    query: { enabled: enabled && !!assetId },
  });

  const equippableAssetDataResponseArray = equippableAssetDataResponse || [];
  const equippableAssetData = {
    metadata: equippableAssetDataResponseArray[0],
    equippableGroupId: equippableAssetDataResponseArray[1],
    catalogAddress: equippableAssetDataResponseArray[2],
    partIds: equippableAssetDataResponseArray[3],
    id: assetId,
  };

  const assetEquippableData = topEquippableAssetData || equippableAssetData;

  const {
    metadata: metadataUri,
    id,
    equippableGroupId,
    partIds,
    catalogAddress,
  } = assetEquippableData || [];
  const catalogPartIds = partIds
    ? partIds.map((partId) => partId.toString())
    : undefined;
};
