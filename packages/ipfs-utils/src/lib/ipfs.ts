import { cid } from 'is-ipfs';

export type IpfsProviders = Record<IPFS_PROVIDERS, string>;
export const ipfsProviders: IpfsProviders = {
  cloudflare: 'https://cloudflare-ipfs.com',
  ipfs: 'https://ipfs.io',
  pinata: 'https://rmrk.mypinata.cloud',
  pinataUnrestricted: 'http://ipfs.rmrk.link',
  nftStorage: 'https://nftstorage.link',
  rmrkIpfsCache: 'https://ipfs2.rmrk.link',
};

export enum IPFS_PROVIDERS {
  cloudflare = 'cloudflare',
  ipfs = 'ipfs',
  pinata = 'pinata',
  pinataUnrestricted = 'pinataUnrestricted',
  nftStorage = 'nftStorage',
  'rmrkIpfsCache' = 'rmrkIpfsCache',
}

export const resolveIpfsProvider = (provider: keyof IpfsProviders = IPFS_PROVIDERS.cloudflare) =>
  ipfsProviders[provider];

export const containsCID = (ipfsUrl?: string | null) => {
  if (typeof ipfsUrl !== 'string') {
    throw new Error('url is not string');
  }
  const splitUrl = ipfsUrl.split(/\/|\?/);
  for (const split of splitUrl) {
    if (cid(split)) {
      return {
        containsCid: true,
        cid: split,
      };
    }
    const splitOnDot = split.split('.')[0];
    if (cid(splitOnDot)) {
      return {
        containsCid: true,
        cid: splitOnDot,
      };
    }
  }

  return {
    containsCid: false,
    cid: '',
  };
};

export const convertToDesiredGateway = (ipfsUrl?: string | null, gatewayPrefixovider?: string) => {
  const results = containsCID(ipfsUrl);
  if (!ipfsUrl || results.containsCid !== true || !results.cid) {
    throw new Error('url does not contain CID');
  }

  const splitUrl = ipfsUrl.split(results.cid);
  //case 1 - the ipfs://cid path
  if (ipfsUrl.includes(`ipfs://${results.cid}`)) {
    return `${gatewayPrefixovider}/ipfs/${results.cid}${splitUrl[1]}`;
  }

  //case 2 - the /ipfs/cid path (this should cover ipfs://ipfs/cid as well
  if (ipfsUrl.includes(`/ipfs/${results.cid}`)) {
    return `${gatewayPrefixovider}/ipfs/${results.cid}${splitUrl[1]}`;
  }

  //case 3 - the /ipns/cid path
  if (ipfsUrl.includes(`/ipns/${results.cid}`)) {
    return `${gatewayPrefixovider}/ipns/${results.cid}${splitUrl[1]}`;
  }

  if (!ipfsUrl.includes('ipfs') && ipfsUrl === results.cid) {
    return `${gatewayPrefixovider}/ipfs/${results.cid}${splitUrl[1]}`;
  }

  console.log(`Unsupported URL pattern: ${ipfsUrl}. Attempting a default fallback.`);
  return `${gatewayPrefixovider}/ipfs/${results.cid}${splitUrl[1]}`;
};

export const sanitizeIpfsUrl = (ipfsUrl?: string | null, provider?: keyof IpfsProviders) => {
  if (!ipfsUrl || typeof ipfsUrl !== 'string') return '';

  if (ipfsUrl.startsWith('http') && !containsCID(ipfsUrl).containsCid) {
    return ipfsUrl.replace('http://', 'https://');
  }

  if (containsCID(ipfsUrl).containsCid) {
    return convertToDesiredGateway(ipfsUrl, resolveIpfsProvider(provider));
  }

  return '';
};
