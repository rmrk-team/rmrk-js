import { IPFS_PROVIDERS, IpfsProviders } from './ipfs';
import { Metadata } from '../types/metadata';
export declare const fetchIpfsNftData: (metadataUri?: string | null, ipfsGateway?: IPFS_PROVIDERS) => Promise<{
    data: Metadata;
    provider?: keyof IpfsProviders;
} | null>;
