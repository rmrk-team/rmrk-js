import type { Metadata } from '@rmrk-team/types';
import { useFetchIpfsMetadata } from './use-fetch-ipfs-metadata.js';

type Arguments = {
  metadataUri: string | undefined;
  ipfsGatewayUrl?: string;
};

type Options = { enabled?: boolean };

interface WithMetadata {
  metadata?: Metadata;
}

/**
 * Fetches metadata using IPFS and adds it to the provided entity.
 *
 * @template T - The type of entity that the metadata will be added to. It should have a 'metadata' property.
 * @param {Arguments} args - The arguments used for fetching metadata.
 * @param {Options} [options] - Optional additional options for fetching metadata.
 * @param {T} [entity] - Optional entity object where the fetched metadata will be added.
 */
export const useFetchMetadataAndAddToEntity = <T extends WithMetadata>(
  args: Arguments,
  options?: Options,
  entity?: T,
) => {
  const { data: metadata, ...otherReactQueryProps } = useFetchIpfsMetadata(
    args,
    options,
  );

  if (entity) {
    entity.metadata = metadata || undefined;
  }

  return { ...otherReactQueryProps, data: entity };
};
