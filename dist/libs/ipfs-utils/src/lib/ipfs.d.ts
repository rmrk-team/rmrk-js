export type IpfsProviders = Record<IPFS_PROVIDERS, string>;
export declare const ipfsProviders: IpfsProviders;
export declare enum IPFS_PROVIDERS {
    cloudflare = "cloudflare",
    ipfs = "ipfs",
    pinata = "pinata",
    pinataUnrestricted = "pinataUnrestricted",
    nftStorage = "nftStorage",
    'rmrkIpfsCache' = "rmrkIpfsCache"
}
export declare const resolveIpfsProvider: (provider?: keyof IpfsProviders) => string;
export declare const containsCID: (ipfsUrl?: string | null) => {
    containsCid: boolean;
    cid: string;
};
export declare const convertToDesiredGateway: (ipfsUrl?: string | null, gatewayPrefixovider?: string) => string;
export declare const sanitizeIpfsUrl: (ipfsUrl?: string | null, provider?: keyof IpfsProviders) => string;
