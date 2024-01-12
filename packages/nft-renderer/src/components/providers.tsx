import React from 'react';
import { WagmiProvider } from './wagmi-provider.js';
import { WalletProvider } from './wallet-provider.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <WalletProvider>{children}</WalletProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
