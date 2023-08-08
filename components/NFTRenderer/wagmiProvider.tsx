import { noopStorage } from "@wagmi/core"
import {
  configureChains,
  createConfig,
  createStorage,
  WagmiConfig,
} from "wagmi"
import { publicProvider } from "wagmi/providers/public"

import { chains } from "./chains"

export const { publicClient, webSocketPublicClient } = configureChains(chains, [
  publicProvider(),
])

const config = createConfig({
  autoConnect: true,
  storage: createStorage({ storage: noopStorage }),
  publicClient,
  webSocketPublicClient,
})

export default function WagmiProvider({ children }: React.PropsWithChildren) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}
