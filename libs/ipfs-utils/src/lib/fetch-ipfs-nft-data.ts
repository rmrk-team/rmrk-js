import { IPFS_PROVIDERS, IpfsProviders, sanitizeIpfsUrl } from './ipfs';
import { Metadata } from '../types/metadata';

export const fetchIpfsNftData = async (
  metadataUri?: string | null,
  ipfsGateway?: IPFS_PROVIDERS,
): Promise<{ data: Metadata; provider?: keyof IpfsProviders } | null> => {
  const gatewayUrl = ipfsGateway || IPFS_PROVIDERS.rmrkIpfsCache;
  const ipfsUrlWithGateway = sanitizeIpfsUrl(metadataUri, gatewayUrl);

  if (!ipfsUrlWithGateway) {
    return null;
  }

  try {
    const response = await fetch(ipfsUrlWithGateway);

    if (response.status === 200) {
      const headers = response.headers.get('content-type');
      if (headers && headers.includes('application/json')) {
        const data = await response.json();
        return { data, provider: gatewayUrl };
      } else {
        // Return early if content-type is not application/json
        return null;
      }
    }
  } catch (error) {
    console.log(`Failed to fetch from ${gatewayUrl} gateway`, error);
  }

  return null;
};
