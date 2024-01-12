# @rmrk-team/ipfs-utils

[![npm version](https://img.shields.io/npm/v/@rmrk-team/rmrk-hooks.svg?style=flat)](https://www.npmjs.com/package/@rmrk-team/ipfs-utils)

Utilities for working with NFT metadata and media stored on ipfs.

## Installation

```bash
pnpm install @rmrk-team/ipfs-utils
```

## Usage

```ts
import { sanitizeIpfsUrl, DEFAULT_IPFS_GATEWAY_URLS, DEFAULT_IPFS_GATEWAY_KEYS, containsCID } from '@rmrk-team/ipfs-utils';

const ipfsUri = 'ipfs://QmVfpP2WQmmRaGk3VPehKxteTvsG465rJDokY3JiyweHBn';
const sanitizedIpfsUrl = sanitizeIpfsUrl(ipfsUri, DEFAULT_IPFS_GATEWAY_URLS[DEFAULT_IPFS_GATEWAY_KEYS.pinata]);
console.log(sanitizedIpfsUrl); // https://gateway.pinata.cloud/ipfs/QmVfpP2WQmmRaGk3VPehKxteTvsG465rJDokY3JiyweHBn

const { containsCid } = containsCID(sanitizedIpfsUrl);
console.log(containsCid); // true
```

```ts
const nftCollectionMetadata = await fetchIpfsMetadata('ipfs://QmVfpP2WQmmRaGk3VPehKxteTvsG465rJDokY3JiyweHBn');

console.log('nftCollectionMetadata', {
    name: nftCollectionMetadata.name,
    image: nftCollectionMetadata.image,
    description: nftCollectionMetadata.description,
});
```


## License
