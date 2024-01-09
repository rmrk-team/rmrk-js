import { Metadata } from '../../types/metadata';
import { useFetchIpfsMetadatas } from './use-fetch-ipfs-metadatas';
import { IPFS_PROVIDERS } from '@rmrk-team/ipfs-utils';

type Arguments = { metadataUris: string[] | undefined; ipfsGateway?: IPFS_PROVIDERS };

type Options = { enabled?: boolean };

interface WithMetadata {
  metadata?: Metadata;
}

type EntityWithMetadata<T> = T & {
  metadata?: Metadata;
};

export const useFetchMetadataAndAddToEntities = <T>(
  args: Arguments,
  options?: Options,
  entities?: T[],
): { isLoading: boolean; isError: boolean; data: EntityWithMetadata<T>[] | undefined } => {
  const { isLoading, isError, data: metadatas } = useFetchIpfsMetadatas(args, options);
  const entitiesWithMetadata = entities?.map((e, i) => ({
    ...e,
    metadata: metadatas?.[i] || undefined,
  }));

  return { isLoading, isError, data: entitiesWithMetadata };
};
