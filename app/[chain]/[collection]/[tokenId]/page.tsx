"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { RMRKEquipRenderUtilsABI } from "@/abi"
import { IResource } from "@lightm-nft/multi-layer-2d-renderer"
import { isAddress } from "viem"
import { useContractRead, usePublicClient } from "wagmi"

import {
  chainNameMapping,
  convertIpfs,
  RMRKRenderUtilsAddressMapping,
} from "@/lib/utils"
import { chains } from "@/app/chains"
import { IMetadata } from "@/app/metadataInterface"

const MultiLayer2DRenderer = dynamic(
  async () => import("@lightm-nft/multi-layer-2d-renderer"),
  { ssr: false }
)

export default function TokenDisplay({
  params,
}: {
  params: { chain: string; collection: `0x${string}`; tokenId: string }
}) {
  const { chain, collection, tokenId } = params
  const publicClient = usePublicClient({
    chainId: chains.find((_chain) => chainNameMapping[chain] === _chain.network)
      ?.id,
  })

  const isValidAddress = isAddress(collection)
  const [isContract, setIsContract] = useState<boolean>()
  const [isGettingIsContract, setIsGettingIsContract] = useState<boolean>(true)

  const searchParams = useSearchParams()
  const advancedMode = searchParams.get("advancedMode") === "true"

  const [renderParts, setRenderParts] = useState<IResource[]>([])

  const chainId = useMemo(() => {
    return chains.find((_chain) => chainNameMapping[chain] === _chain.network)
      ?.id
  }, [chain])

  const renderUtilsParams = {
    address: RMRKRenderUtilsAddressMapping[chain],
    abi: RMRKEquipRenderUtilsABI,
    chainId,
  }

  const {
    data: nftData,
    isError: getNftDataFailed,
    isLoading: isGettingNftData,
  } = useContractRead({
    ...renderUtilsParams,
    functionName: "getExtendedNft",
    args: [BigInt(tokenId), collection],
  })

  const { data: topAsset, isLoading: isGettingTopAsset } = useContractRead({
    ...renderUtilsParams,
    functionName: "getTopAsset",
    args: [collection, BigInt(tokenId)],
  })

  const { data: topEquippableAsset, isLoading: isGettingTED } = useContractRead(
    {
      ...renderUtilsParams,
      functionName: "getTopAssetAndEquippableDataForToken",
      args: [collection, BigInt(tokenId)],
    }
  )

  const mainAsset = useMemo(() => {
    return (
      topEquippableAsset ??
      (topAsset ? { id: topAsset[0], metadata: topAsset[2] } : undefined)
    )
  }, [topEquippableAsset, topAsset])

  const { data: equippableData, isLoading: isComposing } = useContractRead({
    ...renderUtilsParams,
    functionName: "composeEquippables",
    args: [collection, BigInt(tokenId), mainAsset ? mainAsset.id : BigInt(0)],
  })

  useEffect(() => {
    ;(async () => {
      if (isValidAddress) {
        setIsGettingIsContract(true)
        const isContract = await publicClient.getBytecode({
          address: collection,
        })
        setIsContract(!!isContract)
        setIsGettingIsContract(false)
      }
    })()
  }, [collection, isValidAddress, publicClient])

  useEffect(() => {
    ;(async () => {
      if (isValidAddress && isContract && nftData) {
        if (equippableData) {
          const renderParts: IResource[] = await Promise.all([
            ...equippableData[3].map(async (part) => {
              const fixedPartMetadata: IMetadata = await fetch(
                convertIpfs(part.metadataURI)
              ).then((res) => res.json())

              return { z: part.z, src: fixedPartMetadata.mediaUri ?? "" }
            }),
            ...equippableData[4]
              .filter((part) => part.childAssetMetadata)
              .map(async (part) => {
                const slotPartMetadata: IMetadata = await fetch(
                  convertIpfs(part.childAssetMetadata)
                ).then((res) => res.json())

                return { z: part.z, src: slotPartMetadata.mediaUri ?? "" }
              }),
          ])

          setRenderParts(renderParts)
        } else if (mainAsset) {
          const mainAssetMetadata: IMetadata = await fetch(
            convertIpfs(mainAsset.metadata)
          ).then((res) => res.json())

          setRenderParts([{ z: 1, src: mainAssetMetadata.mediaUri ?? "" }])
        } else if (nftData?.tokenMetadataUri) {
          const nftMetadata: IMetadata = await fetch(
            convertIpfs(nftData.tokenMetadataUri)
          ).then((res) => res.json())

          setRenderParts([{ z: 1, src: nftMetadata.mediaUri ?? "" }])
        }
      }
    })()
  }, [equippableData, mainAsset, nftData, isContract, isValidAddress])

  if (chainId === undefined) {
    return (
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        Unsupported chain currently
        <Link href="/">Which chains is supported?</Link>
      </div>
    )
  } else {
    const isLoading =
      isGettingIsContract ||
      isGettingNftData ||
      isGettingTopAsset ||
      isGettingTED ||
      isComposing

    if (isLoading) {
      return (
        <div className="flex flex-col w-screen h-screen justify-center items-center">
          <Image
            className="animate-bounce"
            src="/lightm_outlined.png"
            alt="loading"
            width={128}
            height={128}
          />
        </div>
      )
    }

    return (
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        {isValidAddress === false ? <p>Invalid address</p> : null}
        {isValidAddress && isContract === false ? <p>Not a contract</p> : null}
        {isContract && getNftDataFailed ? <p>Failed to get NFT data</p> : null}

        {advancedMode ? (
          <>
            <h1>
              Token {tokenId} on {chain} in {collection}
            </h1>
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

        {renderParts.length > 0 ? (
          <MultiLayer2DRenderer
            resources={renderParts}
            className="max-w-[1024px] max-h-[1024px] object-contain"
          />
        ) : null}
      </div>
    )
  }
}
