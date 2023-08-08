"use client"

import WagmiProvider from "@/components/NFTRenderer/src/wagmiProvider"

export default function RendererLayout({ children }: React.PropsWithChildren) {
  return <WagmiProvider>{children}</WagmiProvider>
}
