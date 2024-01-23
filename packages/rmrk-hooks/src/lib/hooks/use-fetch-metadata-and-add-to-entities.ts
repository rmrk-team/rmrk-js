import type { Metadata } from '@rmrk-team/types';
import { useFetchIpfsMetadatas } from './use-fetch-ipfs-metadatas.js';

type Arguments = {
  metadataUris: string[] | undefined;
  ipfsGatewayUrl?: string;
};

type Options = { enabled?: boolean };

// interface WithMetadata {
//   metadata?: Metadata;
// }

type EntityWithMetadata<T> = T & {
  metadata?: Metadata;
};

export const useFetchMetadataAndAddToEntities = <T>(
  args: Arguments,
  options?: Options,
  entities?: T[],
): {
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => void;
  data: EntityWithMetadata<T>[] | undefined;
} => {
  const { data: metadatas, ...otherReactQueryProps } = useFetchIpfsMetadatas(
    args,
    options,
  );
  const entitiesWithMetadata = entities?.map((e, i) => ({
    ...e,
    metadata: metadatas?.[i] || undefined,
  }));

  return { ...otherReactQueryProps, data: entitiesWithMetadata };
};
