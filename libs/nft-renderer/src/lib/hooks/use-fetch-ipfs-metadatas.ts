import { useQueries } from '@tanstack/react-query';
import { fetchIpfsMetadata, IPFS_PROVIDERS } from '@rmrk-team/ipfs-utils';

type Props = { metadataUris: string[] | undefined; ipfsGateway?: IPFS_PROVIDERS };

type Options = { enabled?: boolean };

export const useFetchIpfsMetadatas = ({ metadataUris, ipfsGateway }: Props, options?: Options) => {
  const { enabled = true } = options || {};

  const result = useQueries({
    queries: (metadataUris || []).map((metadataUri) => ({
      queryKey: ['fetchIpfsMetadata', metadataUri],
      queryFn: () => fetchIpfsMetadata(metadataUri, ipfsGateway),
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
