"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeIpfsUrl = exports.convertToDesiredGateway = exports.containsCID = exports.resolveIpfsProvider = exports.IPFS_PROVIDERS = exports.ipfsProviders = void 0;
const is_ipfs_1 = require("is-ipfs");
exports.ipfsProviders = {
    cloudflare: 'https://cloudflare-ipfs.com',
    ipfs: 'https://ipfs.io',
    pinata: 'https://rmrk.mypinata.cloud',
    pinataUnrestricted: 'http://ipfs.rmrk.link',
    nftStorage: 'https://nftstorage.link',
    rmrkIpfsCache: 'https://ipfs2.rmrk.link',
};
var IPFS_PROVIDERS;
(function (IPFS_PROVIDERS) {
    IPFS_PROVIDERS["cloudflare"] = "cloudflare";
    IPFS_PROVIDERS["ipfs"] = "ipfs";
    IPFS_PROVIDERS["pinata"] = "pinata";
    IPFS_PROVIDERS["pinataUnrestricted"] = "pinataUnrestricted";
    IPFS_PROVIDERS["nftStorage"] = "nftStorage";
    IPFS_PROVIDERS["rmrkIpfsCache"] = "rmrkIpfsCache";
})(IPFS_PROVIDERS || (exports.IPFS_PROVIDERS = IPFS_PROVIDERS = {}));
const resolveIpfsProvider = (provider = IPFS_PROVIDERS.cloudflare) => exports.ipfsProviders[provider];
exports.resolveIpfsProvider = resolveIpfsProvider;
const containsCID = (ipfsUrl) => {
    if (typeof ipfsUrl !== 'string') {
        throw new Error('url is not string');
    }
    const splitUrl = ipfsUrl.split(/\/|\?/);
    for (const split of splitUrl) {
        if ((0, is_ipfs_1.cid)(split)) {
            return {
                containsCid: true,
                cid: split,
            };
        }
        const splitOnDot = split.split('.')[0];
        if ((0, is_ipfs_1.cid)(splitOnDot)) {
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
exports.containsCID = containsCID;
const convertToDesiredGateway = (ipfsUrl, gatewayPrefixovider) => {
    const results = (0, exports.containsCID)(ipfsUrl);
    if (!ipfsUrl || results.containsCid !== true) {
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
exports.convertToDesiredGateway = convertToDesiredGateway;
const sanitizeIpfsUrl = (ipfsUrl, provider) => {
    if (!ipfsUrl || typeof ipfsUrl !== 'string')
        return '';
    if (ipfsUrl.startsWith('http') && !(0, exports.containsCID)(ipfsUrl).containsCid) {
        return ipfsUrl.replace('http://', 'https://');
    }
    if ((0, exports.containsCID)(ipfsUrl).containsCid) {
        return (0, exports.convertToDesiredGateway)(ipfsUrl, (0, exports.resolveIpfsProvider)(provider));
    }
    return '';
};
exports.sanitizeIpfsUrl = sanitizeIpfsUrl;
