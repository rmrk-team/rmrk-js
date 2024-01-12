import { IPFS_PROVIDERS, fetchIpfsMetadata } from '@rmrk-team/ipfs-utils';
import { useQuery } from '@tanstack/react-query';

type Props = { metadataUri: string | undefined; ipfsGateway?: IPFS_PROVIDERS };

type Options = { enabled?: boolean };

export const useFetchIpfsMetadata = (
  { metadataUri, ipfsGateway }: Props,
  options?: Options,
) => {
  const { enabled = true } = options || {};
  return useQuery({
    queryKey: ['fetchIpfsMetadata', metadataUri],
    queryFn: () => {
      return fetchIpfsMetadata(metadataUri, ipfsGateway);
    },
    enabled,
  });
};
