# @rmrk-team/nft-renderer

[![npm version](https://img.shields.io/npm/v/@rmrk-team/nft-renderer.svg?style=flat)](https://www.npmjs.com/package/@rmrk-team/nft-renderer)

React component for rendering multi-layered composable 2d [RMRK](https://evm.rmrk.app) EVM NFTs.

---

## Installation

```bash
pnpm install @rmrk-team/rmrk-2d-renderer @rmrk-team/nft-renderer
```

## Usage

`// global.css`
```css
@import url('@rmrk-team/rmrk-2d-renderer/dist/styles.css');
@import url('@rmrk-team/nft-renderer/dist/styles.css');

@layer reset, base, tokens, recipes, utilities;
```

```tsx
import React from "react";
import type {Address} from "viem";
import {
  NETWORK_CONTRACTS_PROPS,
  RMRKUtilityContracts,
} from "@rmrk-team/rmrk-evm-utils";
import {RMRKContextProvider} from "@rmrk-team/rmrk-hooks";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {WagmiProvider} from "wagmi";
import {hardhat} from "wagmi/chains";

// Import css
import './global.css'

const queryClient = new QueryClient();

// You can pass custom utility contracts to the RMRKContextProvider
const customUtilityContracts = {
  [hardhat.id]: {
    [NETWORK_CONTRACTS_PROPS.RMRKEquipRenderUtils]: "0x00",
    [NETWORK_CONTRACTS_PROPS.RMRKBulkWriter]: "0x00",
    [NETWORK_CONTRACTS_PROPS.RMRKCollectionUtils]: "0x00",
    [NETWORK_CONTRACTS_PROPS.RMRKCatalogUtils]: "0x00",
  },
} satisfies RMRKUtilityContracts;

const rmrkConfig = {
  utilityContracts: customUtilityContracts,
};

export const NftRendererWrapper = ({
   contractAddress,
   tokenId,
 }: {
  chainId: number;
  contractAddress: Address;
  tokenId: bigint;
}) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RMRKContextProvider config={rmrkConfig}>
          <Flex height="100vh" width="100vw">
            <Flex height="100vh" aspectRatio={"1/1"} margin="0 auto">
              <NFTRenderer
                chainId={chainId}
                contractAddress={contractAddress}
                tokenId={tokenId}
                loader={<Loader/>}
              />
            </Flex>
          </Flex>
        </RMRKContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
```

## Building

```bash

```

## Publishing

```bash

```

## License
