import {
  DEFAULT_IPFS_GATEWAY_KEYS,
  DEFAULT_IPFS_GATEWAY_URLS,
  fetchIpfsMetadata,
} from '@rmrk-team/ipfs-utils';
import { useQuery } from '@tanstack/react-query';

type Props = { metadataUri: string | undefined; ipfsGatewayUrl?: string };

type Options = { enabled?: boolean };

export const useFetchIpfsMetadata = (
  { metadataUri, ipfsGatewayUrl }: Props,
  options?: Options,
) => {
  const { enabled = true } = options || {};
  return useQuery({
    queryKey: ['fetchIpfsMetadata', metadataUri],
    queryFn: () => {
      return fetchIpfsMetadata(
        metadataUri,
        ipfsGatewayUrl ||
          DEFAULT_IPFS_GATEWAY_URLS[DEFAULT_IPFS_GATEWAY_KEYS.cloudflare],
      );
    },
    enabled,
  });
};
