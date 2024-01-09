import { Address } from 'viem';
import { Chain, useContractRead } from 'wagmi';
import { EVM_RMRK_CONTRACTS } from '../rmrk-contract-addresses';
import { RMRKEquipRenderUtils } from '../../abi/RMRKEquipRenderUtils';
import { mapChainIdToNetwork } from '../chain-mapping';
import { RMRKEquippableImpl } from '../../abi/RMRKEquippableImpl';
import { useGetInterfaceSupport } from './use-get-interface-support';

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
  const network = mapChainIdToNetwork(chainId);

  const {
    isLoading,
    interfaceSupport: { supportsEquippable },
  } = useGetInterfaceSupport({ contractAddress: address, chainId }, { enabled });

  const { data: topAsset, isLoading: isGettingTopAsset } = useContractRead({
    address: EVM_RMRK_CONTRACTS[network].renderUtil,
    abi: RMRKEquipRenderUtils,
    chainId,
    functionName: 'getTopAsset',
    args: [address, tokenId],
    enabled: enabled && !assetId,
  });

  const {
    data: topEquippableAssetData,
    isLoading: isLoadingRopEquippableAssetData,
    error: errorTopEquippableAssetData,
    refetch: refetchTopEquippableAssetData,
  } = useContractRead({
    address: enabled && !assetId ? EVM_RMRK_CONTRACTS[network].renderUtil : undefined,
    abi: RMRKEquipRenderUtils,
    chainId,
    functionName: 'getTopAssetAndEquippableDataForToken',
    args: [address, tokenId],
    enabled: enabled && !assetId,
  });

  const {
    data: equippableAssetDataResponse,
    error: errorEquippableAssetData,
    isLoading: isLoadingEquippableAssetData,
    refetch: refetchEquippableAssetData,
  } = useContractRead({
    address: enabled && !!assetId ? address : undefined,
    abi: RMRKEquippableImpl,
    chainId,
    functionName: 'getAssetAndEquippableData',
    args: [tokenId, assetId!],
    enabled: enabled && !!assetId,
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
  const catalogPartIds = partIds ? partIds.map((partId) => partId.toString()) : undefined;
};
