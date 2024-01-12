import {
  EVM_RMRK_CONTRACTS,
  RMRKEquipRenderUtils,
  mapChainIdToNetwork,
} from '@rmrk-team/rmrk-evm-utils';
import type { RMRKAssetExtended } from '@rmrk-team/types';
import type { Address, Chain } from 'viem';
import { useReadContract } from 'wagmi';
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

export const useGetTokenPrimaryAsset = (
  args: Arguments,
  options?: Options,
): {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  primaryAsset: RMRKAssetExtended | undefined;
} => {
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

  const network = mapChainIdToNetwork(chainId);

  const {
    isLoading: isLoadingGetInterfaceSupport,
    interfaceSupport: { supportsEquippable, supportsMultiAsset },
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
    refetch: refetTopAssetForToken,
  } = useReadContract({
    address: enabledSimplePrimaryAsset
      ? EVM_RMRK_CONTRACTS[network]['RMRKEquipRenderUtils']
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
    error: errorTopAssetAndEquippableDataForToken,
    refetch: refetchTopAssetAndEquippableDataForToken,
  } = useReadContract({
    address: enabledAssetWithEquippableData
      ? EVM_RMRK_CONTRACTS[network]['RMRKEquipRenderUtils']
      : undefined,
    abi: RMRKEquipRenderUtils,
    functionName: 'getTopAssetAndEquippableDataForToken',
    chainId,
    args: [contractAddress, tokenId],
    query: { enabled: enabledAssetWithEquippableData },
  });

  const primaryAssetWithEquippableData: RMRKAssetExtended | undefined =
    topAssetAndEquippableDataForToken
      ? {
          id: topAssetAndEquippableDataForToken.id,
          partIds: [...topAssetAndEquippableDataForToken.partIds],
          metadataUri: topAssetAndEquippableDataForToken.metadata,
          equippableGroupId:
            topAssetAndEquippableDataForToken.equippableGroupId,
          catalogAddress: topAssetAndEquippableDataForToken.catalogAddress,
        }
      : undefined;

  const primaryAssetSimple: RMRKAssetExtended | undefined = topAssetForToken
    ? {
        id: topAssetForToken[0],
        metadataUri: topAssetForToken[2],
      }
    : undefined;

  return {
    isLoading:
      isLoadingGetInterfaceSupport ||
      loadingTopAssetForToken ||
      loadingTopAssetAndEquippableDataForToken,
    isError: !!errorTopAsseForToken || !!errorTopAssetAndEquippableDataForToken,
    error: errorTopAsseForToken || errorTopAssetAndEquippableDataForToken,
    refetch: refetchTopAssetAndEquippableDataForToken || refetTopAssetForToken,
    primaryAsset: primaryAssetSimple || primaryAssetWithEquippableData,
  };
};
