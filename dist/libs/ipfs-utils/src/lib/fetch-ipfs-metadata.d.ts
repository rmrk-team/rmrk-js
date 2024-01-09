import { Metadata } from '../types/metadata';
import { IPFS_PROVIDERS } from './ipfs';
export declare const fetchIpfsMetadata: (metadataUri?: string | null, ipfsGateway?: IPFS_PROVIDERS) => Promise<Metadata | null>;
