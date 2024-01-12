import type { Metadata } from '@rmrk-team/types';
import { fetchIpfsNftData } from './fetch-ipfs-nft-data.js';
import { getBase64Value } from './get-base-64-value.js';
import { DEFAULT_IPFS_GATEWAY_KEYS, DEFAULT_IPFS_GATEWAY_URLS, sanitizeIpfsUrl } from './ipfs.js';
import { isBase64Metadata } from './is-base-64-metadata.js';

export const fetchIpfsMetadata = async (
  metadataUri?: string | null,
  ipfsGatewayUrl = DEFAULT_IPFS_GATEWAY_URLS[DEFAULT_IPFS_GATEWAY_KEYS.cloudflare],
): Promise<Metadata | null> => {
  if (metadataUri && isBase64Metadata(metadataUri)) {
    return JSON.parse(getBase64Value(metadataUri)); // TODO: validation
  }

  try {
    const response = await fetchIpfsNftData(metadataUri, ipfsGatewayUrl);
    if (response) {
      const { data: metadata, provider } = response;

      const { animation_url, image, external_url, ...restMetadata } = metadata || {};
      const primaryMedia = animation_url || (metadata as Metadata)?.mediaUri || image;
      const thumbnail = (metadata as Metadata)?.thumbnailUri || (animation_url ? image : '');

      if (provider) {
        return {
          ...restMetadata,
          mediaUri: sanitizeIpfsUrl(primaryMedia || '', provider),
          thumbnailUri: sanitizeIpfsUrl(thumbnail || '', provider),
          externalUri: (metadata as Metadata).externalUri || external_url,
        };
      }
    }
  } catch (error) {
    console.log('Failed to fetch from gateways', error);
  }

  return null;
};
