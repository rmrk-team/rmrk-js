"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIpfsCidFromGatewayUrl = exports.getIpfsCid = void 0;
const getIpfsCid = (ipfsUrl) => {
    const parts = ipfsUrl.split('/');
    return parts[parts.length - 1];
};
exports.getIpfsCid = getIpfsCid;
const getIpfsCidFromGatewayUrl = (gatewayUrl = '') => {
    if (!gatewayUrl.includes('ipfs')) {
        return '';
    }
    const parts = gatewayUrl.split('/ipfs/');
    return parts[parts.length - 1];
};
exports.getIpfsCidFromGatewayUrl = getIpfsCidFromGatewayUrl;
