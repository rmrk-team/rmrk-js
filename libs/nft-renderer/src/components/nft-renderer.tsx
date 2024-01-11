import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Address, isAddress, zeroAddress } from 'viem';
import { useAccount, useContractRead, useContractWrite, usePublicClient } from 'wagmi';
// import { sanitizeIpfsUrl } from '../lib/ipfs';
import { Providers } from './providers';
import { RenderPart } from '../types/types';
import { MultiLayer2DRenderer } from '@rmrk-team/rmrk-2d-renderer';
import { mapChainIdToNetwork, RMRKEquippableImpl } from '@rmrk-team/rmrk-evm-utils';
import {
  useFetchIpfsMetadata,
  useGetAssetData,
  useGetComposedState,
  useGetInterfaceSupport,
} from '@rmrk-team/rmrk-hooks';

interface INFTRenderer {
  chainId: number;
  contractAddress: Address;
  tokenId: string;
  advancedMode?: boolean;
  emoteMode?: boolean;
  loader?: React.ReactNode;
}

/**
 * @description If you have more than 1 NFT to render in the same time, better use `NFTRenderer` rather than current.
 * Add a `WagmiProvider` and wrap it around `NFTRenderer`s to use it.
 */
export default function NFTRendererWithProvider(props: INFTRenderer) {
  return (
    <Providers>
      <NFTRenderer {...props} />
    </Providers>
  );
}

// const graphqlClient = new ApolloClient({
//   uri: emotableIndexerAPI,
//   cache: new InMemoryCache(),
// });

/**
 * @description To use this component, make sure you have a WagmiProvider wrapped it
 */
export function NFTRenderer({
  chainId,
  contractAddress,
  tokenId,
  advancedMode,
  emoteMode = false,
  loader,
}: INFTRenderer) {
  const rendererContainerRef = useRef<null | HTMLDivElement>(null);
  const tokenIdBigint = BigInt(tokenId);
  const network = mapChainIdToNetwork(chainId);

  const publicClient = usePublicClient({
    chainId,
  });

  // const { address: targetEmoter = zeroAddress } = useAccount();

  const isValidAddress = isAddress(contractAddress);
  const [isContract, setIsContract] = useState<boolean>();
  const [isGettingIsContract, setIsGettingIsContract] = useState<boolean>(true);

  const [emotes, setEmotes] = useState<Record<string, number>>({});
  const [haveEmotersUsedEmotes, setHaveEmotersUsedEmotes] = useState<boolean[]>([]);

  // const args = useMemo(() => {
  //   const emoteArr = Object.keys(emotes);
  //
  //   return [
  //     Array.from({ length: emoteArr.length }, () => targetEmoter),
  //     Array.from({ length: emoteArr.length }, () => contractAddress),
  //     Array.from({ length: emoteArr.length }, () => tokenId),
  //     emoteArr,
  //   ];
  // }, [contractAddress, tokenId, emotes, targetEmoter]);

  // const { writeAsync: addEmote } = useContractWrite({
  //   address: EmotableRegistryAddress,
  //   abi: EmotableRegistryABI,
  //   functionName: 'emote',
  //   chainId,
  // });

  useEffect(() => {
    (async () => {
      if (isValidAddress) {
        setIsGettingIsContract(true);
        const isContract = await publicClient.getBytecode({
          address: contractAddress,
        });
        setIsContract(!!isContract);
        setIsGettingIsContract(false);
      }
    })();
  }, [contractAddress, isValidAddress, publicClient]);

  const {
    isLoading: isLoadingGetInterfaceSupport,
    interfaceSupport: { supports721, supportsEquippable, supportsMultiAsset },
  } = useGetInterfaceSupport({ contractAddress, chainId }, { enabled: isContract });

  const {
    data: tokenUri,
    isLoading: isLoadingTokenUri,
    isError: isErrorTokenUri,
  } = useContractRead({
    address: contractAddress,
    abi: RMRKEquippableImpl,
    functionName: 'tokenURI',
    args: [tokenIdBigint],
    chainId,
    enabled: isContract && supports721,
  });
  const {
    data: tokenMetadata,
    isLoading: isLoadingTokenMetadata,
    isError: isErrorTokenMetadata,
  } = useFetchIpfsMetadata({ metadataUri: tokenUri });

  const {
    asset: primaryAsset,
    isLoading: isLoadingPrimaryAsset,
    isError: isErrorPrimaryAsset,
    error: errorPrimaryAsset,
  } = useGetAssetData({ tokenId: tokenIdBigint, contractAddress, chainId });

  const {
    isLoading: isLoadingComposableState,
    isError: isErrorComposableState,
    error: errorComposableState,
    data: composableState,
  } = useGetComposedState(
    {
      tokenId: tokenIdBigint,
      chainId,
      contractAddress,
      supportsEquippableInterface: supportsEquippable,
      supportsMultiAssetInterface: supportsMultiAsset,
    },
    { enabled: isContract },
  );

  const {
    fixedPartsWithMetadatas,
    slotPartsWithMetadatas,
    equippableGroupId,
    assetMetadataUri,
    catalogAddress,
  } = composableState;

  const catalogRenderParts: RenderPart[] | undefined =
    fixedPartsWithMetadatas && slotPartsWithMetadatas
      ? [
          ...fixedPartsWithMetadatas.map((p) => ({ z: p.z, src: p.metadata?.mediaUri || '' })),
          ...slotPartsWithMetadatas.map((p) => ({ z: p.z, src: p.metadata?.mediaUri || '' })),
        ]
      : undefined;

  const assetRenderPart: RenderPart[] | undefined = primaryAsset
    ? [{ z: 1, src: primaryAsset?.metadata?.mediaUri || primaryAsset?.metadata?.image || '' }]
    : undefined;

  const tokenRenderPart: RenderPart[] | undefined = primaryAsset
    ? [{ z: 1, src: tokenMetadata?.mediaUri || tokenMetadata?.image || '' }]
    : undefined;

  const renderParts = catalogRenderParts || assetRenderPart || tokenRenderPart;

  // useEffect(() => {
  //   (async () => {
  //     if (isValidAddress && isContract) {
  //       const {
  //         data: { countEmotesByTokenId },
  //       } = await graphqlClient.query({
  //         query: gql`
  //           query GetEmotesCountQuery($tokenId: String!) {
  //             countEmotesByTokenId(token_id: $tokenId) {
  //               emoji
  //               emojiCount
  //             }
  //           }
  //         `,
  //         variables: {
  //           tokenId: `${chainId}-${collection}-${tokenId}`,
  //         },
  //       });
  //
  //       const _emotes = (countEmotesByTokenId as { emoji: string; emojiCount: number }[]).reduce(
  //         (prev: Record<string, number>, curr: { emoji: string; emojiCount: number }) => {
  //           const { emoji, emojiCount } = curr;
  //
  //           (prev as any)[emoji] = emojiCount;
  //
  //           return prev;
  //         },
  //         {} as Record<string, number>,
  //       );
  //
  //       setEmotes(_emotes);
  //     }
  //   })();
  // }, [chainId, collection, isContract, isValidAddress, tokenId]);

  // useEffect(() => {
  //   (async () => {
  //     if (isValidAddress && isContract && nftData) {
  //       if (equippableData) {
  //         const renderParts: IResource[] = await Promise.all([
  //           ...equippableData[3].map(async (part) => {
  //             const fixedPartMetadata: Metadata = await fetch(
  //               sanitizeIpfsUrl(part.metadataURI),
  //             ).then((res) => res.json());
  //
  //             return { z: part.z, src: fixedPartMetadata.mediaUri ?? '' };
  //           }),
  //           ...equippableData[4]
  //             .filter((part) => part.childAssetMetadata)
  //             .map(async (part) => {
  //               const slotPartMetadata: Metadata = await fetch(
  //                 sanitizeIpfsUrl(part.childAssetMetadata),
  //               ).then((res) => res.json());
  //
  //               return { z: part.z, src: slotPartMetadata.mediaUri ?? '' };
  //             }),
  //         ]);
  //
  //         setRenderParts(renderParts);
  //       } else if (mainAsset) {
  //         const mainAssetMetadata: Metadata = await fetch(sanitizeIpfsUrl(mainAsset.metadata)).then(
  //           (res) => res.json(),
  //         );
  //
  //         setRenderParts([{ z: 1, src: mainAssetMetadata.mediaUri ?? '' }]);
  //       } else if (nftData?.tokenMetadataUri) {
  //         const nftMetadata: Metadata = await fetch(sanitizeIpfsUrl(nftData.tokenMetadataUri)).then(
  //           (res) => res.json(),
  //         );
  //
  //         setRenderParts([{ z: 1, src: nftMetadata.mediaUri ?? '' }]);
  //       }
  //     }
  //   })();
  // }, [equippableData, mainAsset, nftData, isContract, isValidAddress]);

  // useEffect(() => {
  //   if (emoteMode) {
  //     getEmotableInfos();
  //   }
  // }, [getEmotableInfos, emoteMode]);

  if (chainId === undefined) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        Unsupported chain
      </div>
    );
  } else {
    const isLoading =
      isGettingIsContract ||
      isLoadingTokenUri ||
      isLoadingPrimaryAsset ||
      isLoadingTokenMetadata ||
      isLoadingComposableState ||
      isLoadingGetInterfaceSupport;

    return (
      <div
        ref={rendererContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {isLoading ? (
          <div style={{ alignSelf: 'center' }}>{loader}</div>
        ) : (
          <>
            {isValidAddress === false ? <p>Invalid address</p> : null}
            {isValidAddress && isContract === false ? <p>Not a contract</p> : null}
            {isContract && isErrorTokenUri ? <p>Failed to get NFT data</p> : null}

            {advancedMode ? (
              <>
                <h1>
                  Token {tokenId} on {network} in {contractAddress}
                </h1>
                {composableState ? (
                  <div>
                    <>
                      <p>Is Equippable</p>
                      <p>metadataURI: {assetMetadataUri}</p>
                      <p>groupId: {equippableGroupId?.toString()}</p>
                      <p>catalog: {catalogAddress}</p>
                    </>
                  </div>
                ) : primaryAsset ? (
                  <p>metadataURI: {primaryAsset.metadataUri}</p>
                ) : tokenUri ? (
                  <p>metadataURI: {tokenUri}</p>
                ) : null}
              </>
            ) : null}

            {/*{emoteMode && emotes ? (*/}
            {/*  <Popover>*/}
            {/*    <PopoverTrigger className="absolute bottom-4 right-4">*/}
            {/*      <Badge className="text-2xl hover:scale-110 transition-all">❤️</Badge>*/}
            {/*    </PopoverTrigger>*/}
            {/*    <PopoverContent className="flex justify-start items-start gap-4 max-w-[95vw] w-[640px] relative">*/}
            {/*      <Picker*/}
            {/*        data={data}*/}
            {/*        onEmojiSelect={async (data: any) => {*/}
            {/*          if (targetEmoter !== zeroAddress) {*/}
            {/*            const result = await addEmote({*/}
            {/*              args: [collection, tokenId, data.native, true],*/}
            {/*            });*/}

            {/*            await getEmotableInfos();*/}
            {/*          } else {*/}
            {/*            open();*/}
            {/*          }*/}
            {/*        }}*/}
            {/*      />*/}
            {/*      <div className="flex flex-wrap gap-2">*/}
            {/*        {Object.entries(emotes).map(([emote, count], i) => {*/}
            {/*          const isEmoted = (haveEmotersUsedEmotes as boolean[])?.[i] ?? false;*/}

            {/*          return (*/}
            {/*            <Badge*/}
            {/*              key={i}*/}
            {/*              variant={isEmoted ? 'default' : 'outline'}*/}
            {/*              className="cursor-pointer"*/}
            {/*              onClick={async () => {*/}
            {/*                if (targetEmoter !== zeroAddress) {*/}
            {/*                  const result = await addEmote({*/}
            {/*                    args: [collection, tokenId, emote, !isEmoted],*/}
            {/*                  });*/}

            {/*                  await getEmotableInfos();*/}
            {/*                } else {*/}
            {/*                  open();*/}
            {/*                }*/}
            {/*              }}*/}
            {/*            >*/}
            {/*              {emote} {count}*/}
            {/*            </Badge>*/}
            {/*          );*/}
            {/*        })}*/}
            {/*      </div>*/}
            {/*      <div className="absolute bottom-2 right-2">*/}
            {/*        <Web3Button />*/}
            {/*      </div>*/}
            {/*    </PopoverContent>*/}
            {/*  </Popover>*/}
            {/*) : null}*/}

            {renderParts && renderParts.length > 0 ? (
              <MultiLayer2DRenderer
                resources={renderParts}
                resizeObserveRef={rendererContainerRef}
                theme={primaryAsset?.metadata?.theme}
                fillBgWithImageBlur
                loader={loader}
                style={{
                  aspectRatio: '1/1',
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                }}
              />
            ) : null}
          </>
        )}
      </div>
    );
  }
}
