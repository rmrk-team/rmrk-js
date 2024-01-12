# @rmrk-team/nft-renderer

[![npm version](https://img.shields.io/npm/v/@rmrk-team/nft-renderer.svg?style=flat)](https://www.npmjs.com/package/@rmrk-team/nft-renderer)

React component for rendering multi-layered composable 2d [RMRK](https://evm.rmrk.app) EVM NFTs.

## Installation

```bash
pnpm install @rmrk-team/nft-renderer
```

## Usage

```tsx
import { Address } from "viem";

export const NftRendererWrapper
({
     chainId, contractAddress, tokenId
 }: {
    chainId: number, contractAddress: Address, tokenId: bigint
}) => {
    return (
        <Flex height="100vh" width="100vw">
            <Flex height="100vh" aspectRatio={'1/1'} margin="0 auto">
                <NFTRenderer
                    chainId={chainId}
                    contractAddress={collection}
                    tokenId={tokenId}
                    loader={<Loader/>}
                />
            </Flex>
        </Flex>
    );
}
```

## Building

```bash

```

## Publishing

```bash

```

## License
