import { useQuery } from '@tanstack/react-query';
import { fetchIpfsMetadata, IPFS_PROVIDERS } from '@rmrk-team/ipfs-utils';

type Props = { metadataUri: string | undefined; ipfsGateway?: IPFS_PROVIDERS };

type Options = { enabled?: boolean };

export const useFetchIpfsMetadata = ({ metadataUri, ipfsGateway }: Props, options?: Options) => {
  const { enabled = true } = options || {};
  return useQuery({
    queryKey: ['fetchIpfsMetadata', metadataUri],
    queryFn: () => {
      return fetchIpfsMetadata(metadataUri, ipfsGateway);
    },
    enabled,
  });
};
