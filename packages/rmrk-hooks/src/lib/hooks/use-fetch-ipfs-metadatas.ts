import {
  DEFAULT_IPFS_GATEWAY_KEYS,
  DEFAULT_IPFS_GATEWAY_URLS,
  fetchIpfsMetadata,
} from '@rmrk-team/ipfs-utils';
import { useQueries } from '@tanstack/react-query';
import { useCallback } from 'react';

type Props = {
  metadataUris: string[] | undefined;
  ipfsGatewayUrl?: string;
};

type Options = { enabled?: boolean };

export const useFetchIpfsMetadatas = (
  { metadataUris, ipfsGatewayUrl }: Props,
  options?: Options,
) => {
  const { enabled = true } = options || {};

  const results = useQueries({
    queries: (metadataUris || []).map((metadataUri) => ({
      queryKey: ['fetchIpfsMetadata', metadataUri],
      queryFn: () =>
        fetchIpfsMetadata(
          metadataUri,
          ipfsGatewayUrl ||
            DEFAULT_IPFS_GATEWAY_URLS[DEFAULT_IPFS_GATEWAY_KEYS.cloudflare],
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
