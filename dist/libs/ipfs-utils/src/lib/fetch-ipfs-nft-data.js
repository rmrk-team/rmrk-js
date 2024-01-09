"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchIpfsNftData = void 0;
const ipfs_1 = require("./ipfs");
const fetchIpfsNftData = async (metadataUri, ipfsGateway) => {
    const gatewayUrl = ipfsGateway || ipfs_1.IPFS_PROVIDERS.rmrkIpfsCache;
    const ipfsUrlWithGateway = (0, ipfs_1.sanitizeIpfsUrl)(metadataUri, gatewayUrl);
    if (!ipfsUrlWithGateway) {
        return null;
    }
    try {
        const response = await fetch(ipfsUrlWithGateway);
        if (response.status === 200) {
            const headers = response.headers.get('content-type');
            if (headers && headers.includes('application/json')) {
                const data = await response.json();
                return { data, provider: gatewayUrl };
            }
            else {
                // Return early if content-type is not application/json
                return null;
            }
        }
    }
    catch (error) {
        console.log(`Failed to fetch from ${gatewayUrl} gateway`, error);
    }
    return null;
};
exports.fetchIpfsNftData = fetchIpfsNftData;
