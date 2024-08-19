import { wagmiConfig } from 'lib/wagmi-config';
import type React from 'react';
import { WagmiProvider as WagmiProviderInner } from 'wagmi';

export const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProviderInner config={wagmiConfig}>{children}</WagmiProviderInner>
  );
};
