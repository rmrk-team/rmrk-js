import { Metadata } from './metadata';

export type RMRKAssetExtended = {
  id: bigint;
  metadataUri?: string;
  metadata?: Metadata;
  partIds?: bigint[];
  catalogAddress?: string;
  equippableGroupId?: bigint;
};
