"use client";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { chains } from "./chains";

export const { publicClient, webSocketPublicClient } = configureChains(chains, [
  publicProvider(),
]);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function WagmiProvider({ children }: React.PropsWithChildren) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
