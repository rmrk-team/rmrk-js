"use client";

import {
  RMRKRenderUtilsAddressMapping,
  chainNameMapping,
  convertIpfs,
} from "./utils";
import { useContractRead } from "wagmi";
import { useSearchParams } from "next/navigation";
import MultiLayer2DRenderer, {
  IResource,
} from "@lightm-nft/multi-layer-2d-renderer";
import { useEffect, useMemo, useState } from "react";
import { RMRKEquipRenderUtilsABI } from "@/abi";
import { chains } from "@/app/chains";
import { IMetadata } from "@/app/metadataInterface";

export default function TokenDisplay({
  params,
}: {
  params: { chain: string; collection: `0x${string}`; tokenId: string };
}) {
  const { chain, collection, tokenId } = params;

  const searchParams = useSearchParams();

  const advancedMode = searchParams.get("advancedMode") === "true";

  const [renderParts, setRenderParts] = useState<IResource[]>([]);

  const chainId = useMemo(() => {
    return chains.find((_chain) => chainNameMapping[chain] === _chain.network)
      ?.id;
  }, [chain]);

  const renderUtilsParams = {
    address: RMRKRenderUtilsAddressMapping[chain],
    abi: RMRKEquipRenderUtilsABI,
    chainId,
  };

  const { data: nftData, isError: getNftDataFailed } = useContractRead({
    ...renderUtilsParams,
    functionName: "getExtendedNft",
    args: [BigInt(tokenId), collection],
  });

  const { data: topAsset } = useContractRead({
    ...renderUtilsParams,
    functionName: "getTopAsset",
    args: [collection, BigInt(tokenId)],
  });

  const { data: topEquippableAsset } = useContractRead({
    ...renderUtilsParams,
    functionName: "getTopAssetAndEquippableDataForToken",
    args: [collection, BigInt(tokenId)],
  });

  const mainAsset = useMemo(() => {
    return (
      topEquippableAsset ??
      (topAsset
        ? { id: topAsset[0], metadata: topAsset[2] }
        : { id: BigInt(0), metadata: "" })
    );
  }, [topEquippableAsset, topAsset]);

  const { data: equippableData, isError: getEquippableDataFailed } =
    useContractRead({
      ...renderUtilsParams,
      functionName: "composeEquippables",
      args: [collection, BigInt(tokenId), mainAsset ? mainAsset.id : BigInt(0)],
    });

  useEffect(() => {
    (async () => {
      if (equippableData) {
        const renderParts: IResource[] = await Promise.all([
          ...equippableData[3].map(async (part) => {
            const fixedPartMetadata: IMetadata = await fetch(
              convertIpfs(part.metadataURI)
            ).then((res) => res.json());

            return { z: part.z, src: fixedPartMetadata.mediaUri ?? "" };
          }),
          ...equippableData[4]
            .filter((part) => part.childAssetMetadata)
            .map(async (part) => {
              const slotPartMetadata: IMetadata = await fetch(
                convertIpfs(part.childAssetMetadata)
              ).then((res) => res.json());

              return { z: part.z, src: slotPartMetadata.mediaUri ?? "" };
            }),
        ]);

        setRenderParts(renderParts);
      } else if (mainAsset) {
        const mainAssetMetadata: IMetadata = await fetch(
          convertIpfs(mainAsset.metadata)
        ).then((res) => res.json());

        setRenderParts([{ z: 1, src: mainAssetMetadata.mediaUri ?? "" }]);
      } else if (nftData?.tokenMetadataUri) {
        const nftMetadata: IMetadata = await fetch(
          convertIpfs(nftData.tokenMetadataUri)
        ).then((res) => res.json());

        setRenderParts([{ z: 1, src: nftMetadata.mediaUri ?? "" }]);
      }
    })();
  }, [equippableData, mainAsset, nftData]);

  if (chains.some((_chain) => chainNameMapping[chain] === _chain.network)) {
    return (
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        {advancedMode ? (
          <>
            <h1>
              Token {tokenId} on {chain} in {collection}
            </h1>
            <p>{getNftDataFailed && <span>Failed to get NFT data</span>}</p>
            {equippableData ? (
              <div>
                <>
                  <p>Is Equippable</p>
                  <p>metadataURI: {equippableData[0]}</p>
                  <p>groupId: {equippableData[1].toString()}</p>
                  <p>catalog: {equippableData[2]}</p>
                </>
              </div>
            ) : mainAsset ? (
              <p>metadataURI: {mainAsset.metadata}</p>
            ) : nftData?.tokenMetadataUri ? (
              <p>metadataURI: {nftData.tokenMetadataUri}</p>
            ) : null}
          </>
        ) : null}

        <MultiLayer2DRenderer
          resources={renderParts}
          className="max-w-[1024px] max-h-[1024px] object-contain"
        />
      </div>
    );
  } else {
    return <div>The chain is not supported currently.</div>;
  }
}
