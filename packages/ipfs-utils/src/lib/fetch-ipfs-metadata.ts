import type { Metadata } from '@rmrk-team/types';
import { fetchIpfsNftData } from './fetch-ipfs-nft-data.js';
import { getBase64Value } from './get-base-64-value.js';
import {
  DEFAULT_IPFS_GATEWAY_KEYS,
  DEFAULT_IPFS_GATEWAY_URLS,
  sanitizeIpfsUrl,
} from './ipfs.js';
import { isBase64Metadata } from './is-base-64-metadata.js';

type Options = {
  shouldSanitizeIpfsUrls?: boolean;
  ipfsGatewayUrl?: string;
};

export const fetchIpfsMetadata = async (
  metadataUri?: string | null,
  options?: Options,
): Promise<Metadata | null> => {
  const {
    shouldSanitizeIpfsUrls = true,
    ipfsGatewayUrl = DEFAULT_IPFS_GATEWAY_URLS[
      DEFAULT_IPFS_GATEWAY_KEYS.pinata
    ],
  } = options || {};
  if (metadataUri && isBase64Metadata(metadataUri)) {
    return JSON.parse(getBase64Value(metadataUri)); // TODO: validation
  }

  try {
    const response = await fetchIpfsNftData(metadataUri, ipfsGatewayUrl);
    if (response) {
      const { data: metadata, provider } = response;

      const { animation_url, image, external_url, ...restMetadata } =
        metadata || {};
      const thumbnail =
        (metadata as Metadata)?.thumbnailUri || (animation_url ? image : '');

      if (provider) {
        return {
          ...restMetadata,
          image,
          animation_url,
          mediaUri: shouldSanitizeIpfsUrls
            ? sanitizeIpfsUrl((metadata as Metadata)?.mediaUri || '', provider)
            : (metadata as Metadata)?.mediaUri,
          thumbnailUri: shouldSanitizeIpfsUrls
            ? sanitizeIpfsUrl(thumbnail || '', provider)
            : thumbnail,
          externalUri: (metadata as Metadata).externalUri || external_url,
        };
      }
    }
  } catch (error) {
    console.log('Failed to fetch from gateways', error);
  }

  return null;
};
