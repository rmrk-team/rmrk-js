import React from 'react';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from '../lib/web3/wagmi-config.js';

export const WagmiProvider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};
