import React from 'react';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from 'lib/wagmi-config';

export const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};
