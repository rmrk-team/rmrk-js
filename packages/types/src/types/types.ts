import type { Metadata } from './metadata.js';

export type RMRKAssetExtended = {
  id: bigint;
  metadataUri?: string;
  metadata?: Metadata;
  partIds?: bigint[];
  catalogAddress?: string;
  equippableGroupId?: bigint;
};
