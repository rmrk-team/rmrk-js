import { MultiLayer2DRenderer } from '@rmrk-team/rmrk-2d-renderer';
import {
  RMRKEquippableImpl,
  mapChainIdToNetwork,
} from '@rmrk-team/rmrk-evm-utils';
import {
  useFetchIpfsMetadata,
  useGetAssetData,
  useGetComposedState,
  useGetInterfaceSupport,
} from '@rmrk-team/rmrk-hooks';
import React, { useEffect, useRef, useState } from 'react';
import { isAddress } from 'viem';
import type { Address } from 'viem';
import { usePublicClient, useReadContract } from 'wagmi';
import type { RenderPart } from '../types/types.js';
// import { sanitizeIpfsUrl } from '../lib/ipfs';
import { Providers } from './providers.js';

interface INFTRenderer {
  chainId: number;
  contractAddress: Address;
  tokenId: string;
  advancedMode?: boolean;
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

/**
 * @description To use this component, make sure you have a WagmiProvider wrapped it
 */
export function NFTRenderer({
  chainId,
  contractAddress,
  tokenId,
  advancedMode,
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

  // const [emotes, setEmotes] = useState<Record<string, number>>({});
  // const [haveEmotersUsedEmotes, setHaveEmotersUsedEmotes] = useState<boolean[]>([]);

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
  } = useGetInterfaceSupport(
    { contractAddress, chainId },
    { enabled: isContract },
  );

  const {
    data: tokenUri,
    isLoading: isLoadingTokenUri,
    isError: isErrorTokenUri,
  } = useReadContract({
    address: contractAddress,
    abi: RMRKEquippableImpl,
    functionName: 'tokenURI',
    args: [tokenIdBigint],
    chainId,
    query: { enabled: isContract && supports721 },
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
          ...fixedPartsWithMetadatas.map((p) => ({
            z: p.z,
            src: p.metadata?.mediaUri || '',
          })),
          ...slotPartsWithMetadatas.map((p) => ({
            z: p.z,
            src: p.metadata?.mediaUri || '',
          })),
        ]
      : undefined;

  const assetRenderPart: RenderPart[] | undefined = primaryAsset
    ? [
        {
          z: 1,
          src:
            primaryAsset?.metadata?.mediaUri ||
            primaryAsset?.metadata?.image ||
            '',
        },
      ]
    : undefined;

  const tokenRenderPart: RenderPart[] | undefined = primaryAsset
    ? [{ z: 1, src: tokenMetadata?.mediaUri || tokenMetadata?.image || '' }]
    : undefined;

  const renderParts = catalogRenderParts || assetRenderPart || tokenRenderPart;

  const isError =
    isErrorTokenUri ||
    isErrorTokenMetadata ||
    isErrorPrimaryAsset ||
    isErrorComposableState;

  const error = errorComposableState || errorPrimaryAsset;

  if (error) {
    console.warn(error);
  }

  if (isError) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        Someting went wrong
      </div>
    );
  }

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
            {isValidAddress && isContract === false ? (
              <p>Not a contract</p>
            ) : null}
            {isContract && isErrorTokenUri ? (
              <p>Failed to get NFT data</p>
            ) : null}

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
