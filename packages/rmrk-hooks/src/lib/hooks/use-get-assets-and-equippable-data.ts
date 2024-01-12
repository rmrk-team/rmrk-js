// import { useEffect, useState } from 'react';
// import { useReadContracts } from 'wagmi';
// import type { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype';
// import type { Address, Chain } from 'viem';
// import { fetchIpfsMetadata } from '@rmrk-team/ipfs-utils';
// import type { Metadata } from '@rmrk-team/types';
// import { AddressZero, RMRKEquippableImpl } from '@rmrk-team/rmrk-evm-utils';
// import type { ExcludesAllFalsy } from '@rmrk-team/rmrk-evm-utils';
//
// type Asset = {
//   id: bigint;
//   catalogAddress: Address | undefined;
//   partIds: bigint[] | undefined;
//   equippableGroupId: bigint | undefined;
//   metadataUri: string;
//   metadata: Metadata | undefined;
// };
//
// type NftAssetArg = {
//   contractAddress: Address;
//   nftId: bigint;
//   assetId: bigint;
// };
//
// export type NftAssetArgWithResourceObject = NftAssetArg & {
//   asset: Asset;
// };
//
// type Arguments = {
//   nftAssetArgs: NftAssetArg[];
//   chainId: Chain['id'];
// };
//
// type Options = {
//   enabled?: boolean;
//   enabledMetadataFetch?: boolean;
// };
//
// export type EquippableResourcesResponse = AbiParametersToPrimitiveTypes<
//   ExtractAbiFunction<typeof RMRKEquippableImpl, 'getAssetAndEquippableData'>['outputs']
// >;
//
// /**
//  * This contract fetches a single resource for multiple equipped NFTs in inventory
//  * We assume that all NFTs in inventory support equippable interface and are active
//  * @param args
//  * @param options
//  */
// export const useGetAssetsAndEquippableData = (args: Arguments, options?: Options) => {
//   const { nftAssetArgs, chainId } = args;
//   const { enabled = true, enabledMetadataFetch = true } = options || {};
//
//   // const network = mapChainIdToNetwork(chainId);
//
//   const [loadingMetadatas, setLoadingMetadatas] = useState<boolean>(false);
//   const [errorMetadatas, setErrorMetadatas] = useState<unknown>();
//   const [assets, setAssets] = useState<NftAssetArgWithResourceObject[]>([]);
//
//   // If contract support equippable interface then resources have more fields like slots and base and uses different function
//   const {
//     data: equippableAssetsResponse,
//     error: errorEquippableAssets,
//     isLoading: loadingEquippableAssets,
//     refetch: refetchEquippableAssets,
//   } = useReadContracts({
//     contracts: (nftAssetArgs || []).map((nftAssetArg) => ({
//       address: nftAssetArg.contractAddress,
//       abi: RMRKEquippableImpl,
//       chainId,
//       functionName: 'getAssetAndEquippableData',
//       args: [BigInt(nftAssetArg.nftId), BigInt(nftAssetArg.assetId)],
//     })),
//     query: { enabled: enabled && Boolean(nftAssetArgs && nftAssetArgs.length > 0) },
//   });
//
//   const equippableAssetsResponseTyped = equippableAssetsResponse?.map((res) => res.result) as
//     | (EquippableResourcesResponse | null)[]
//     | undefined;
//
//   const assetsResponse: Asset[] | undefined =
//     equippableAssetsResponseTyped
//       ?.map((equippableResource, index) => {
//         const id = nftAssetArgs[index]?.assetId;
//         if (equippableResource === null || !id) {
//           return null;
//         }
//         const [metadataUri, equippableGroupId, catalogAddress, parts] = equippableResource;
//
//         return {
//           id,
//           metadataUri,
//           catalogAddress,
//           isComposable: Boolean(
//             catalogAddress && catalogAddress !== AddressZero && parts?.length > 0,
//           ),
//           partIds: parts ? parts.map((part) => part) : undefined,
//           metadata: undefined,
//           equippableGroupId: equippableGroupId,
//         };
//       })
//       .filter(Boolean as any as ExcludesAllFalsy) ?? undefined;
//
//   // TODO: Change this to use new fetch metadatas redis hook soon
//   useEffect(() => {
//     if (assetsResponse && assetsResponse.length > 0 && enabledMetadataFetch) {
//       const fetchMetadatas = async () => {
//         try {
//           setLoadingMetadatas(true);
//           const assetsWithMetadata = await Promise.all(
//             assetsResponse.map(async (asset, index) => {
//               const nftAssetArg = nftAssetArgs[index];
//               const metadata = (await fetchIpfsMetadata(asset.metadataUri)) || undefined;
//               if (nftAssetArg) {
//                 return { ...nftAssetArg, asset: { ...asset, metadata } };
//               } else {
//                 return undefined;
//               }
//             }),
//           );
//
//           setAssets(assetsWithMetadata.filter(Boolean as any as ExcludesAllFalsy));
//           setLoadingMetadatas(false);
//         } catch (e) {
//           setLoadingMetadatas(false);
//           setErrorMetadatas(e);
//         }
//       };
//
//       fetchMetadatas();
//     } else {
//       const assetsWithResourceData =
//         assetsResponse
//           ?.map((asset, index) => {
//             const nftAssetArg = nftAssetArgs[index];
//             if (nftAssetArg) {
//               return { ...nftAssetArg, asset };
//             } else {
//               return undefined;
//             }
//           })
//           .filter(Boolean as any as ExcludesAllFalsy) || [];
//       setAssets(assetsWithResourceData);
//     }
//   }, [JSON.stringify(assetsResponse), enabledMetadataFetch]);
//
//   const loading = loadingMetadatas || loadingEquippableAssets;
//   const error = errorMetadatas || errorEquippableAssets;
//
//   return { nftAssets: assets, refetch: refetchEquippableAssets, loading, error };
// };
