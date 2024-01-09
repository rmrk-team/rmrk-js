import { Address, Chain, useContractRead } from 'wagmi';
import { EVM_RMRK_CONTRACTS } from '../rmrk-contract-addresses';
import { mapChainIdToNetwork } from '../chain-mapping';
import { RMRKEquipRenderUtils } from '../../abi/RMRKEquipRenderUtils';
import { useGetInterfaceSupport } from './use-get-interface-support';
import { RMRKAssetExtended } from '../../types/types';

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
    supportsEquippableInterface === undefined || supportsMultiAssetInterface === undefined;

  const network = mapChainIdToNetwork(chainId);

  const {
    isLoading: isLoadingGetInterfaceSupport,
    interfaceSupport: { supportsEquippable, supportsMultiAsset },
  } = useGetInterfaceSupport(
    { contractAddress, chainId },
    { enabled: enabled && requiresInterfaceCheck },
  );

  const enabledSimplePrimaryAsset = enabled && supportsMultiAsset && !supportsEquippable;
  const enabledAssetWithEquippableData = enabled && supportsEquippable;

  const {
    data: topAssetForToken,
    isLoading: loadingTopAssetForToken,
    error: errorTopAsseForToken,
    refetch: refetTopAssetForToken,
  } = useContractRead({
    address: enabledSimplePrimaryAsset ? EVM_RMRK_CONTRACTS[network]['renderUtil'] : undefined,
    abi: RMRKEquipRenderUtils,
    functionName: 'getTopAsset',
    chainId,
    args: [contractAddress, tokenId],
    enabled: enabledSimplePrimaryAsset,
  });

  const {
    data: topAssetAndEquippableDataForToken,
    isLoading: loadingTopAssetAndEquippableDataForToken,
    error: errorTopAssetAndEquippableDataForToken,
    refetch: refetchTopAssetAndEquippableDataForToken,
  } = useContractRead({
    address: enabledAssetWithEquippableData ? EVM_RMRK_CONTRACTS[network]['renderUtil'] : undefined,
    abi: RMRKEquipRenderUtils,
    functionName: 'getTopAssetAndEquippableDataForToken',
    chainId,
    args: [contractAddress, tokenId],
    enabled: enabledAssetWithEquippableData,
  });

  const primaryAssetWithEquippableData: RMRKAssetExtended | undefined =
    topAssetAndEquippableDataForToken
      ? {
          id: topAssetAndEquippableDataForToken.id,
          partIds: [...topAssetAndEquippableDataForToken.partIds],
          metadataUri: topAssetAndEquippableDataForToken.metadata,
          equippableGroupId: topAssetAndEquippableDataForToken.equippableGroupId,
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
