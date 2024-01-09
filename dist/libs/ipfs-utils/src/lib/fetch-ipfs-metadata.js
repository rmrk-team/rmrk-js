"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchIpfsMetadata = void 0;
const is_base_64_metadata_1 = require("./is-base-64-metadata");
const get_base_64_value_1 = require("./get-base-64-value");
const fetch_ipfs_nft_data_1 = require("./fetch-ipfs-nft-data");
const ipfs_1 = require("./ipfs");
const fetchIpfsMetadata = async (metadataUri, ipfsGateway) => {
    if (metadataUri && (0, is_base_64_metadata_1.isBase64Metadata)(metadataUri)) {
        return JSON.parse((0, get_base_64_value_1.getBase64Value)(metadataUri)); // TODO: validation
    }
    try {
        const response = await (0, fetch_ipfs_nft_data_1.fetchIpfsNftData)(metadataUri, ipfsGateway);
        if (response) {
            const { data: metadata, provider } = response;
            const { animation_url, image, external_url, ...restMetadata } = metadata || {};
            const primaryMedia = animation_url || metadata?.mediaUri || image;
            const thumbnail = metadata?.thumbnailUri || (animation_url ? image : '');
            if (provider) {
                return {
                    ...restMetadata,
                    mediaUri: (0, ipfs_1.sanitizeIpfsUrl)(primaryMedia || '', provider),
                    thumbnailUri: (0, ipfs_1.sanitizeIpfsUrl)(thumbnail || '', provider),
                    externalUri: metadata.externalUri || external_url,
                };
            }
        }
    }
    catch (error) {
        console.log(`Failed to fetch from gateways`, error);
    }
    return null;
};
exports.fetchIpfsMetadata = fetchIpfsMetadata;
