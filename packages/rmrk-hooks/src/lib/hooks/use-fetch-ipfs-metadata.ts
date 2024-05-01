import {
  DEFAULT_IPFS_GATEWAY_KEYS,
  DEFAULT_IPFS_GATEWAY_URLS,
  fetchIpfsMetadata,
} from '@rmrk-team/ipfs-utils';
import { useQuery } from '@tanstack/react-query';
import { useRMRKConfig } from '../RMRKContext.js';

type Props = { metadataUri: string | undefined; ipfsGatewayUrl?: string };

type Options = { enabled?: boolean; shouldSanitizeIpfsUrls?: boolean };

/**
 * Fetches IPFS metadata and returns the result using React Query's `useQuery` hook.
 *
 * @param {Object} props - The props object.
 * @param {string} props.metadataUri - The URI of the IPFS metadata to fetch.
 * @param {string} props.ipfsGatewayUrl - The URL of the IPFS gateway to use for fetching.
 * @param {Object} [options] - The options object.
 * @param {boolean} [options.enabled=true] - Indicates whether the fetch should be enabled.
 */
export const useFetchIpfsMetadata = ({ metadataUri, ipfsGatewayUrl }: Props, options?: Options) => {
  const rmrkConfig = useRMRKConfig();
  const { enabled = true, shouldSanitizeIpfsUrls = true } = options || {};
  return useQuery({
    queryKey: ['fetchIpfsMetadata', metadataUri],
    queryFn: () => {
      return fetchIpfsMetadata(metadataUri, {
        ipfsGatewayUrl:
          ipfsGatewayUrl ||
          rmrkConfig?.ipfsGateway ||
          DEFAULT_IPFS_GATEWAY_URLS[DEFAULT_IPFS_GATEWAY_KEYS.cloudflare],
        shouldSanitizeIpfsUrls,
      });
    },
    enabled,
  });
};
