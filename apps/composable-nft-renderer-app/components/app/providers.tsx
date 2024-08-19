'use client';

import {
  NETWORK_CONTRACTS_PROPS,
  type RMRKUtilityContracts,
} from '@rmrk-team/rmrk-evm-utils';
import { RMRKContextProvider } from '@rmrk-team/rmrk-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'components/app/wagmi-provider';
import type React from 'react';
import { hardhat } from 'wagmi/chains';

const queryClient = new QueryClient();

// You can pass custom utility contracts to the RMRKContextProvider
const customUtilityContracts = {
  [hardhat.id]: {
    [NETWORK_CONTRACTS_PROPS.RMRKEquipRenderUtils]:
      '0x15622b7C6bD7D3c213689a1E3c8878a01fF44974',
    [NETWORK_CONTRACTS_PROPS.RMRKBulkWriter]:
      '0xD28B08c1d46e692c9ca891f0608fF285919E633E',
    [NETWORK_CONTRACTS_PROPS.RMRKCollectionUtils]:
      '0x16fD480f38F795A6c5f545F88840206e1e49258b',
    [NETWORK_CONTRACTS_PROPS.RMRKCatalogUtils]:
      '0x9Bc12be12016c04c53a1d41f9e453A53E006D857',
  },
} satisfies RMRKUtilityContracts;

const rmrkConfig = {
  utilityContracts: customUtilityContracts,
  ipfsGateway: 'https://ipfs.io',
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider>
      <QueryClientProvider client={queryClient}>
        <RMRKContextProvider config={rmrkConfig}>
          {children}
        </RMRKContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
