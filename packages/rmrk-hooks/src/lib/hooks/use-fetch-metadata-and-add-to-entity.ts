import { useFetchIpfsMetadata } from './use-fetch-ipfs-metadata.js';
import { IPFS_PROVIDERS } from '@rmrk-team/ipfs-utils';
import type { Metadata } from '@rmrk-team/types';

type Arguments = { metadataUri: string | undefined; ipfsGateway?: IPFS_PROVIDERS };

type Options = { enabled?: boolean };

interface WithMetadata {
  metadata?: Metadata;
}

export const useFetchMetadataAndAddToEntity = <T extends WithMetadata>(
  args: Arguments,
  options?: Options,
  entity?: T,
) => {
  const {
    isLoading,
    error,
    isError,
    refetch,
    data: metadata,
  } = useFetchIpfsMetadata(args, options);

  if (entity) {
    entity.metadata = metadata || undefined;
  }

  return { isLoading, isError, error, refetch, data: entity };
};
