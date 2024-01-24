# @rmrk-team/rmrk-hooks

[![npm version](https://img.shields.io/npm/v/@rmrk-team/rmrk-hooks.svg?style=flat)](https://www.npmjs.com/package/@rmrk-team/nft-renderer)

React hooks for working with [RMRK](https://evm.rmrk.app) EVM NFTs.

## Installation

```bash
pnpm install @rmrk-team/rmrk-hooks
```

## Usage


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

export const Container = ({
   contractAddress,
   tokenId,
 }: {
  chainId: number;
  contractAddress: Address;
  tokenId: bigint;
  children: React.ReactNode;
}) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RMRKContextProvider config={rmrkConfig}>
            {children}
        </RMRKContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

```

```tsx
import {
    useFetchIpfsMetadata,
    useGetAssetData,
    useGetComposedState,
    useGetInterfaceSupport,
} from '@rmrk-team/rmrk-hooks';

type Props = {
    contractAddress: Address;
    tokenId: bigint;
    chainId: number;
}

export const Example = ({contractAddress, tokenId, chainId}: Props) => {
    const {
        isLoading: isLoadingComposableState,
        isError: isErrorComposableState,
        error: errorComposableState,
        data: composableState,
    } = useGetComposedState(
        {
            tokenId,
            chainId,
            contractAddress,
        }
    );

    const {
        fixedPartsWithMetadatas,
        slotPartsWithMetadatas,
        equippableGroupId,
        assetMetadataUri,
        catalogAddress,
    } = composableState;
    
    console.log(composableState)
    return null;
}
```

```tsx

export const App = () => {
    return (
        <Container>
            <Example />
        </Container>
    )   
}

```

## Building

```bash

```

## Publishing

```bash

```

## License
