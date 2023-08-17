import { noopStorage } from "@wagmi/core"
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum"
import { Web3Modal } from "@web3modal/react"
import {
  configureChains,
  createConfig,
  createStorage,
  WagmiConfig,
} from "wagmi"
import { publicProvider } from "wagmi/providers/public"

import { chains } from "./chains"

const projectId = "8a7809823b9d935958451c4e89bcbfc0"

export const { publicClient, webSocketPublicClient } = configureChains(chains, [
  w3mProvider({ projectId }),
  publicProvider(),
])

const config = createConfig({
  autoConnect: true,
  storage: createStorage({ storage: noopStorage }),
  connectors: w3mConnectors({ chains, projectId }),
  publicClient,
  webSocketPublicClient,
})

const ethereumClient = new EthereumClient(config, chains)

export default function WalletProvider({ children }: React.PropsWithChildren) {
  return (
    <>
      <WagmiConfig config={config}>{children}</WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}
