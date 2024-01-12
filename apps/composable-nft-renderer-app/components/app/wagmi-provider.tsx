import { wagmiConfig } from 'lib/wagmi-config';
import React from 'react';
import { WagmiConfig } from 'wagmi';

export const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};
