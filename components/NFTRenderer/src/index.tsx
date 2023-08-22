import { useCallback, useEffect, useMemo, useState } from "react"
import { ApolloClient, gql, InMemoryCache } from "@apollo/client"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import MultiLayer2DRenderer, {
  IResource,
} from "@lightm-nft/multi-layer-2d-renderer"
import { isAddress, zeroAddress } from "viem"
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePublicClient,
} from "wagmi"

import { EmotableRegistryABI, RMRKEquipRenderUtilsABI } from "./abi"
import { chains } from "./chains"
import { IMetadata } from "./metadataInterface"
import {
  convertIpfs,
  emotableIndexerAPI,
  EmotableRegistryAddress,
  RMRKRenderUtilsAddressMapping,
} from "./utils"
import WagmiProvider from "./walletProvider"

import "./index.css"

import { useWeb3Modal, Web3Button } from "@web3modal/react"

import { Badge } from "./components/badge"
import { Popover, PopoverContent, PopoverTrigger } from "./components/popover"

interface INFTRenderer {
  chainId?: number
  collection: `0x${string}`
  tokenId: string
  advancedMode?: boolean
  emoteMode?: boolean
}

/**
 * @description If you have more than 1 NFT to render in the same time, better use `NFTRenderer` rather than current.
 * Add a `WagmiProvider` and wrap it around `NFTRenderer`s to use it.
 */
export default function NFTRendererWithProvider(props: INFTRenderer) {
  return (
    <WagmiProvider>
      <NFTRenderer {...props} />
    </WagmiProvider>
  )
}

export { WagmiProvider }

const graphqlClient = new ApolloClient({
  uri: emotableIndexerAPI,
  cache: new InMemoryCache(),
})

/**
 * @description To use this component, make sure you have a WagmiProvider wrapped it
 */
export function NFTRenderer({
  chainId,
  collection,
  tokenId,
  advancedMode,
  emoteMode = false,
}: INFTRenderer) {
  const supportedChain = chains.find((_chain) => _chain.id === chainId)

  const publicClient = usePublicClient({
    chainId,
  })

  const { address: targetEmoter = zeroAddress } = useAccount()

  const { open } = useWeb3Modal()

  const isValidAddress = isAddress(collection)
  const [isContract, setIsContract] = useState<boolean>()
  const [isGettingIsContract, setIsGettingIsContract] = useState<boolean>(true)

  const [emotes, setEmotes] = useState<Record<string, number>>({})
  const [haveEmotersUsedEmotes, setHaveEmotersUsedEmotes] = useState<boolean[]>([])

  const [renderParts, setRenderParts] = useState<IResource[]>([])

  const renderUtilsParams = {
    address: RMRKRenderUtilsAddressMapping[supportedChain?.network ?? ""],
    abi: RMRKEquipRenderUtilsABI,
    chainId,
  }

  const args = useMemo(() => {
    const emoteArr = Object.keys(emotes)

    return [
      Array.from({ length: emoteArr.length }, () => targetEmoter),
      Array.from({ length: emoteArr.length }, () => collection),
      Array.from({ length: emoteArr.length }, () => tokenId),
      emoteArr,
    ]
  }, [collection, tokenId, emotes, targetEmoter])

  const getEmotableInfos = useCallback(async () => {
    const data = await publicClient.readContract({
      address: EmotableRegistryAddress,
      abi: EmotableRegistryABI,
      functionName: "haveEmotersUsedEmotes",
      args,
    })

    setHaveEmotersUsedEmotes(data as boolean[])
  }, [args, publicClient])

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

  const { writeAsync: addEmote } = useContractWrite({
    address: EmotableRegistryAddress,
    abi: EmotableRegistryABI,
    functionName: "emote",
    chainId,
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
      if (isValidAddress && isContract) {
        const {
          data: { countEmotesByTokenId },
        } = await graphqlClient.query({
          query: gql`
            query GetEmotesCountQuery($tokenId: String!) {
              countEmotesByTokenId(token_id: $tokenId) {
                emoji
                emojiCount
              }
            }
          `,
          variables: {
            tokenId: `${chainId}-${collection}-${tokenId}`,
          },
        })

        const _emotes = (
          countEmotesByTokenId as { emoji: string; emojiCount: number }[]
        ).reduce(
          (
            prev: Record<string, number>,
            curr: { emoji: string; emojiCount: number }
          ) => {
            const { emoji, emojiCount } = curr

            ;(prev as any)[emoji] = emojiCount

            return prev
          },
          {} as Record<string, number>
        )

        setEmotes(_emotes)
      }
    })()
  }, [chainId, collection, isContract, isValidAddress, tokenId])

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

  useEffect(() => {
    if (emoteMode) {
      getEmotableInfos()
    }
  }, [getEmotableInfos, emoteMode]);

  if (chainId === undefined) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        Unsupported chain currently
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
        <div className="flex flex-col w-full h-full justify-center items-center">
          <img
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
      <div className="flex flex-col w-full h-full justify-center items-center">
        {isValidAddress === false ? <p>Invalid address</p> : null}
        {isValidAddress && isContract === false ? <p>Not a contract</p> : null}
        {isContract && getNftDataFailed ? <p>Failed to get NFT data</p> : null}

        {advancedMode ? (
          <>
            <h1>
              Token {tokenId} on {supportedChain?.name} in {collection}
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

        {emoteMode && emotes ? (
          <Popover>
            <PopoverTrigger className="absolute bottom-4 right-4">
              <Badge className="text-2xl hover:scale-110 transition-all">
                ❤️
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="flex justify-start items-start gap-4 max-w-[95vw] w-[640px] relative">
              <Picker
                data={data}
                onEmojiSelect={async (data: any) => {
                  if (targetEmoter !== zeroAddress) {
                    const result = await addEmote({
                      args: [collection, tokenId, data.native, true],
                    })

                    await getEmotableInfos()
                  } else {
                    open()
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {Object.entries(emotes).map(([emote, count], i) => {
                  const isEmoted =
                    (haveEmotersUsedEmotes as boolean[])?.[i] ?? false

                  return (
                    <Badge
                      key={i}
                      variant={isEmoted ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={async () => {
                        if (targetEmoter !== zeroAddress) {
                          const result = await addEmote({
                            args: [collection, tokenId, emote, !isEmoted],
                          })

                          await getEmotableInfos()
                        } else {
                          open()
                        }
                      }}
                    >
                      {emote} {count}
                    </Badge>
                  )
                })}
              </div>
              <div className="absolute bottom-2 right-2">
                <Web3Button />
              </div>
            </PopoverContent>
          </Popover>
        ) : null}

        {renderParts.length > 0 ? (
          <MultiLayer2DRenderer
            resources={renderParts}
            className="max-w-full max-h-full object-contain"
          />
        ) : null}
      </div>
    )
  }
}
