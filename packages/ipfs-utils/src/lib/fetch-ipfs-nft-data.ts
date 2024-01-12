import type { Metadata } from '@rmrk-team/types';
import { DEFAULT_IPFS_GATEWAY_KEYS, sanitizeIpfsUrl } from './ipfs.js';
import type { IpfsGateways } from './ipfs.js';

export const fetchIpfsNftData = async (
  metadataUri?: string | null,
  ipfsGateway?: DEFAULT_IPFS_GATEWAY_KEYS,
): Promise<{ data: Metadata; provider?: keyof IpfsGateways } | null> => {
  const gatewayUrl = ipfsGateway || DEFAULT_IPFS_GATEWAY_KEYS.pinata;
  const ipfsUrlWithGateway = sanitizeIpfsUrl(metadataUri, gatewayUrl);

  if (!ipfsUrlWithGateway) {
    return null;
  }

  try {
    const response = await fetch(ipfsUrlWithGateway);

    if (response.status === 200) {
      const headers = response.headers.get('content-type');
      if (headers?.includes('application/json')) {
        const data = await response.json();
        return { data, provider: gatewayUrl };
      }

      // Return early if content-type is not application/json
      return null;
    }
  } catch (error) {
    console.log(`Failed to fetch from ${gatewayUrl} gateway`, error);
  }

  return null;
};
