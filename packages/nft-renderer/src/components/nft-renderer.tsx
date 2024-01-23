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
import { css } from 'styled-system/css';
import { isAddress } from 'viem';
import type { Address } from 'viem';
import { usePublicClient, useReadContract } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import '../styles/index.css';
import type { RenderPart } from '../types/types.js';

type NFTRenderer = {
  chainId: Chain['id'];
  contractAddress: Address;
  tokenId: bigint;
  advancedMode?: boolean;
  loader?: React.ReactNode;
  onError?: (error: Error) => void;
};

/**
 * @description To use this component, make sure you have a WagmiProvider wrapped it
 */
export function NFTRenderer({
  chainId,
  contractAddress,
  tokenId,
  advancedMode,
  loader,
  onError,
}: NFTRenderer) {
  const rendererContainerRef = useRef<null | HTMLDivElement>(null);
  const tokenIdBigint = BigInt(tokenId);
  const network = mapChainIdToNetwork(chainId);

  const publicClient = usePublicClient({
    chainId,
  });

  const isValidAddress = isAddress(contractAddress);
  const [isContract, setIsContract] = useState<boolean>();
  const [isGettingIsContract, setIsGettingIsContract] = useState<boolean>(true);

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
    isFetching,
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

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (chainId === undefined && onError) {
      onError(new Error(`Unsupported chain ${chainId}`));
    }
  }, [chainId, onError]);

  if (error) {
    console.warn(error);
  }

  if (isError || chainId === undefined) {
    return null;
  }

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
      className={css({
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      })}
    >
      {isLoading ? (
        <div
          className={css({
            alignSelf: 'center',
          })}
        >
          {loader}
        </div>
      ) : (
        <>
          {isValidAddress === false ? <p>Invalid address</p> : null}
          {isValidAddress && !isContract ? <p>Not a contract</p> : null}
          {isContract && isErrorTokenUri ? <p>Failed to get NFT data</p> : null}

          {advancedMode ? (
            <>
              <h1>
                Token {tokenId.toString()} on {network} in {contractAddress}
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
              className={css({
                aspectRatio: '1/1',
                objectFit: 'contain',
                width: '100%',
                height: '100%',
              })}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
