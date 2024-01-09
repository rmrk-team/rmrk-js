import { useEffect, useState } from 'react';
import { Chain, useContractReads } from 'wagmi';
import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype';
import { Address } from 'viem';
import { Metadata } from '../../types/metadata';
import { RMRKEquippableImpl } from '../../abi/RMRKEquippableImpl';
import { mapChainIdToNetwork } from '../chain-mapping';
import { AddressZero } from '../web3/consts';
import { ExcludesAllFalsy } from '../exclude-all-falsy';
import { fetchIpfsMetadata } from '@rmrk-team/ipfs-utils';

type Asset = {
  id: bigint;
  catalogAddress: Address | undefined;
  partIds: bigint[] | undefined;
  equippableGroupId: bigint | undefined;
  metadataUri: string;
  metadata: Metadata | undefined;
};

type NftAssetArg = {
  contractAddress: Address;
  nftId: bigint;
  assetId: bigint;
};

export type NftAssetArgWithResourceObject = NftAssetArg & {
  asset: Asset;
};

type Arguments = {
  nftAssetArgs: NftAssetArg[];
  chainId: Chain['id'];
};

type Options = {
  enabled?: boolean;
  enabledMetadataFetch?: boolean;
};

export type EquippableResourcesResponse = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<typeof RMRKEquippableImpl, 'getAssetAndEquippableData'>['outputs']
>;

/**
 * This contract fetches a single resource for multiple equipped NFTs in inventory
 * We assume that all NFTs in inventory support equippable interface and are active
 * @param args
 * @param options
 */
export const useGetAssetsAndEquippableData = (args: Arguments, options?: Options) => {
  const { nftAssetArgs, chainId } = args;
  const { enabled = true, enabledMetadataFetch = true } = options || {};

  const network = mapChainIdToNetwork(chainId);

  const [loadingMetadatas, setLoadingMetadatas] = useState<boolean>(false);
  const [errorMetadatas, setErrorMetadatas] = useState<unknown>();
  const [assets, setAssets] = useState<NftAssetArgWithResourceObject[]>([]);

  // If contract support equippable interface then resources have more fields like slots and base and uses different function
  const {
    data: equippableAssetsResponse,
    error: errorEquippableAssets,
    isLoading: loadingEquippableAssets,
    refetch: refetchEquippableAssets,
  } = useContractReads({
    contracts: (nftAssetArgs || []).map((nftAssetArg) => ({
      address: nftAssetArg.contractAddress,
      abi: RMRKEquippableImpl,
      chainId,
      functionName: 'getAssetAndEquippableData',
      args: [BigInt(nftAssetArg.nftId), BigInt(nftAssetArg.assetId)],
    })),
    enabled: enabled && Boolean(nftAssetArgs && nftAssetArgs.length > 0),
  });

  const equippableAssetsResponseTyped = equippableAssetsResponse?.map((res) => res.result) as
    | (EquippableResourcesResponse | null)[]
    | undefined;

  const assetsResponse: Asset[] | undefined =
    equippableAssetsResponseTyped
      ?.map((equippableResource, index) => {
        if (equippableResource === null) {
          return null;
        }
        const [metadataUri, equippableGroupId, catalogAddress, parts] = equippableResource;

        return {
          id: nftAssetArgs[index].assetId,
          metadataUri,
          catalogAddress,
          isComposable: Boolean(
            catalogAddress && catalogAddress !== AddressZero && parts?.length > 0,
          ),
          partIds: parts ? parts.map((part) => part) : undefined,
          metadata: undefined,
          equippableGroupId: equippableGroupId,
        };
      })
      .filter(Boolean as any as ExcludesAllFalsy) ?? undefined;

  // TODO: Change this to use new fetch metadatas redis hook soon
  useEffect(() => {
    if (assetsResponse && assetsResponse.length > 0 && enabledMetadataFetch) {
      const fetchMetadatas = async () => {
        try {
          setLoadingMetadatas(true);
          const assetsWithMetadata = await Promise.all(
            assetsResponse.map(async (asset, index) => {
              const metadata = (await fetchIpfsMetadata(asset.metadataUri)) || undefined;
              return { ...nftAssetArgs[index], asset: { ...asset, metadata } };
            }),
          );

          setAssets(assetsWithMetadata);
          setLoadingMetadatas(false);
        } catch (e) {
          setLoadingMetadatas(false);
          setErrorMetadatas(e);
        }
      };

      fetchMetadatas();
    } else {
      setAssets(
        assetsResponse?.map((asset, index) => ({
          ...nftAssetArgs[index],
          asset,
        })) || [],
      );
    }
  }, [JSON.stringify(assetsResponse), enabledMetadataFetch]);

  const loading = loadingMetadatas || loadingEquippableAssets;
  const error = errorMetadatas || errorEquippableAssets;

  return { nftAssets: assets, refetch: refetchEquippableAssets, loading, error };
};
