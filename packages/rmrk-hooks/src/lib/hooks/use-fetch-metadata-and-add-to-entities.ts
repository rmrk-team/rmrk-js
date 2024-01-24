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

/**
 * Uses the `useFetchIpfsMetadatas` hook to fetch metadata for a given array of entities and adds the metadata to each entity.
 *
 * @template T The type of the entities.
 * @param {Arguments} args The arguments for the fetch function.
 * @param {Options} [options] The options for the fetch function.
 * @param {T[]} [entities] The array of entities to add metadata to.
 * @returns {{ isLoading: boolean, isError: boolean, isFetching: boolean, refetch: () => void, data: EntityWithMetadata<T>[] | undefined }} The result object containing properties indicating
 * the loading, error, and data status, along with the refetch function and the array of entities with metadata.
 */
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
