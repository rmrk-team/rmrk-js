import {
  DEFAULT_IPFS_GATEWAY_KEYS,
  DEFAULT_IPFS_GATEWAY_URLS,
  fetchIpfsMetadata,
} from '@rmrk-team/ipfs-utils';
import { useQueries } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useRMRKConfig } from '../RMRKContextProvider.js';

type Props = {
  metadataUris: string[] | undefined;
  ipfsGatewayUrl?: string;
};

type Options = { enabled?: boolean, shouldSanitizeIpfsUrls?: boolean; };

/**
 * A custom hook that fetches IPFS metadata for the given URIs.
 * @param {Object} props - The properties object.
 * @param {Array} props.metadataUris - The URIs of the metadata to fetch.
 * @param {string} props.ipfsGatewayUrl - The URL of the IPFS gateway to use.
 * @param {Object} options - Optional options object.
 * @param {boolean} options.enabled - Whether the hook is enabled or not. Defaults to true.
 * @property {boolean} isLoading - Indicates if the metadata is currently being loaded.
 * @property {boolean} isError - Indicates if an error occurred while fetching the metadata.
 * @property {boolean} isFetching - Indicates if the metadata is currently being fetched.
 * @property {Array|undefined} data - The fetched metadata. Undefined if metadataUris is not provided.
 * @property {Function} refetch - A function to manually trigger a re-fetch of the metadata.
 */
export const useFetchIpfsMetadatas = (
  { metadataUris, ipfsGatewayUrl }: Props,
  options?: Options,
) => {
  const rmrkConfig = useRMRKConfig();
  const { enabled = true, shouldSanitizeIpfsUrls = true } = options || {};

  const results = useQueries({
    queries: (metadataUris || []).map((metadataUri) => ({
      queryKey: ['fetchIpfsMetadata', metadataUri],
      queryFn: () =>
        fetchIpfsMetadata(
          metadataUri,
            {
              ipfsGatewayUrl: ipfsGatewayUrl ||
                  rmrkConfig?.ipfsGateway ||
                  DEFAULT_IPFS_GATEWAY_URLS[DEFAULT_IPFS_GATEWAY_KEYS.cloudflare],
              shouldSanitizeIpfsUrls
            }
        ),
      enabled,
    })),
  });

  const refetchAll = useCallback(() => {
    results.forEach((result) => result.refetch());
  }, [results]);

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);
  const isFetching = results.some((r) => r.isFetching);

  return {
    isLoading,
    isError,
    isFetching,
    data: metadataUris ? results.map((r) => r.data) : undefined,
    refetch: refetchAll,
  };
};
