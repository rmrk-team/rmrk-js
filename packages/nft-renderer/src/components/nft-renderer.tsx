import { sanitizeIpfsUrl } from '@rmrk-team/ipfs-utils';
import { MultiLayer2DRenderer } from '@rmrk-team/rmrk-2d-renderer';
import { RMRKCatalogImpl, RMRKEquippableImpl } from '@rmrk-team/rmrk-evm-utils';
import {
  useFetchIpfsMetadata,
  useGetAssetData,
  useGetComposedState,
  useGetInterfaceSupport,
  useRMRKConfig,
} from '@rmrk-team/rmrk-hooks';
import React, { useEffect, useRef, useState } from 'react';
import { isAddress } from 'viem';
import type { Address } from 'viem';
import { usePublicClient, useReadContract } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import { css } from '../styled-system/css/css.js';
import type { RenderPart } from '../types/types.js';

const useIsAddressAContract = ({
  address,
  chainId,
  onError,
}: {
  address: Address;
  chainId: Chain['id'];
  onError?: (error: Error) => void;
}) => {
  const publicClient = usePublicClient({
    chainId,
  });

  const [isContract, setIsContract] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const isValidAddress = isAddress(address);

    if (chainId && publicClient) {
      if (isValidAddress) {
        (async () => {
          setIsLoading(true);
          const isContract = await publicClient.getBytecode({
            address,
          });

          setIsContract(!!isContract);
          setIsLoading(false);
          if (!isContract) {
            setError(new Error(`Address ${address} is not a contract`));
          }
        })();
      } else {
        setError(new Error(`Address ${address} is not a valid address`));
      }
    }
  }, [address, chainId, publicClient]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return {
    isContract,
    isLoading,
    error,
    isError: !!error,
  };
};

type NFTRenderer = {
  chainId: Chain['id'];
  contractAddress: Address;
  tokenId: bigint;
  advancedMode?: boolean;
  loader?: React.ReactNode;
  onError?: (error: Error) => void;
};

/**
 * Renders a multi layered RMRK NFT based on the provided parameters.
 *
 * @param {Object} options - The options for rendering the NFT.
 * @param {string} options.chainId - The chain ID of the blockchain network.
 * @param {string} options.contractAddress - The address of the contract containing the NFT.
 * @param {string} options.tokenId - The ID of the token to render.
 * @param {ReactNode} options.loader - The loader component to display while the NFT is loading.
 * @param {Function} options.onError - The callback function to handle errors.
 */
export function NFTRenderer({
  chainId,
  contractAddress,
  tokenId,
  loader,
  onError,
}: NFTRenderer) {
  const rendererContainerRef = useRef<null | HTMLDivElement>(null);
  const tokenIdBigint = BigInt(tokenId);

  const rmrkConfig = useRMRKConfig();

  const {
    isContract,
    isLoading: isLoadingIsContract,
    isError: isErrorIsContract,
    error: errorIsContract,
  } = useIsAddressAContract({ address: contractAddress, chainId });

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

  const {
    data: catalogType,
    isLoading: loadingCatalogType,
    error: errorCatalogType,
    isError: isErrorCatalogType,
  } = useReadContract({
    address: catalogAddress,
    abi: RMRKCatalogImpl,
    functionName: 'getType',
    chainId,
    query: { enabled: !!catalogAddress },
  });

  const isImageCatalogType =
    !!catalogType &&
    (catalogType.startsWith('image/') ||
      catalogType.startsWith('img/') ||
      ['image', 'img', 'png', 'jpg', 'jpeg', 'svg'].includes(catalogType));

  const catalogRenderParts: RenderPart[] | undefined =
    fixedPartsWithMetadatas && slotPartsWithMetadatas
      ? [
          ...fixedPartsWithMetadatas.map((p) => ({
            z: p.z,
            src: sanitizeIpfsUrl(
              p.metadata?.mediaUri || p.metadata?.image || '',
              rmrkConfig.ipfsGateway,
            ),
          })),
          ...slotPartsWithMetadatas.map((p) => ({
            z: p.z,
            src: sanitizeIpfsUrl(
              p.metadata?.mediaUri || p.metadata?.image || '',
              rmrkConfig.ipfsGateway,
            ),
          })),
        ]
      : undefined;

  const assetRenderPart: RenderPart[] | undefined = primaryAsset
    ? [
        {
          z: 1,
          src: sanitizeIpfsUrl(
            primaryAsset?.metadata?.mediaUri ||
              primaryAsset?.metadata?.image ||
              '',
            rmrkConfig.ipfsGateway,
          ),
        },
      ]
    : undefined;

  const tokenRenderPart: RenderPart[] | undefined = primaryAsset
    ? [
        {
          z: 1,
          src: sanitizeIpfsUrl(
            tokenMetadata?.mediaUri || tokenMetadata?.image || '',
            rmrkConfig.ipfsGateway,
          ),
        },
      ]
    : undefined;

  const renderParts = catalogRenderParts || assetRenderPart || tokenRenderPart;

  const isError =
    isErrorTokenUri ||
    isErrorTokenMetadata ||
    isErrorPrimaryAsset ||
    isErrorComposableState ||
    isErrorIsContract ||
    isErrorCatalogType;

  const error =
    errorComposableState ||
    errorPrimaryAsset ||
    errorIsContract ||
    errorCatalogType;

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
    isLoadingIsContract ||
    isLoadingTokenUri ||
    isLoadingPrimaryAsset ||
    isLoadingTokenMetadata ||
    isLoadingComposableState ||
    isLoadingGetInterfaceSupport ||
    loadingCatalogType;

  if (!isLoading && !isImageCatalogType) {
    return (
      <div>
        <p>Unsupported catalog type: {catalogType}</p>
      </div>
    );
  }

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
