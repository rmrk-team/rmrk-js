import {
  DEFAULT_IPFS_GATEWAY_KEYS,
  DEFAULT_IPFS_GATEWAY_URLS,
  fetchIpfsMetadata,
} from '@rmrk-team/ipfs-utils';
import { useQueries } from '@tanstack/react-query';

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

  const result = useQueries({
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

  const isLoading = result.some((r) => r.isLoading);
  const isError = result.some((r) => r.isError);

  return {
    isLoading,
    isError,
    data: metadataUris ? result.map((r) => r.data) : undefined,
  };
};
