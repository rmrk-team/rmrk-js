'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'components/app/wagmi-provider';
import React from 'react';
import { RMRKContextProvider } from '@rmrk-team/rmrk-hooks';
import {
  NETWORK_CONTRACTS_PROPS,
  RMRKUtilityContracts,
} from '@rmrk-team/rmrk-evm-utils';
import { hardhat } from 'wagmi/chains';

const queryClient = new QueryClient();

// You can pass custom utility contracts to the RMRKContextProvider
const customUtilityContracts = {
  [hardhat.id]: {
    [NETWORK_CONTRACTS_PROPS.RMRKEquipRenderUtils]: '0x00',
    [NETWORK_CONTRACTS_PROPS.RMRKBulkWriter]: '0x00',
    [NETWORK_CONTRACTS_PROPS.RMRKCollectionUtils]: '0x00',
  },
} satisfies RMRKUtilityContracts;

const rmrkConfig = {
  utilityContracts: customUtilityContracts,
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
