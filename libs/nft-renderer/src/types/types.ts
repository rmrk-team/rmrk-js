import { Metadata } from './metadata';

export type RMRKAssetExtended = {
  id: bigint;
  metadataUri?: string;
  metadata?: Metadata;
  partIds?: bigint[];
  catalogAddress?: string;
  equippableGroupId?: bigint;
};

// TODO: I feel like we would benefit from more data here
export type RenderPart = {
  z: number;
  mediaUri?: string;
  src: string;
};
