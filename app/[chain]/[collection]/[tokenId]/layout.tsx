"use client"

import WagmiProvider from "@/components/NFTRenderer/wagmiProvider"

export default function RendererLayout({ children }: React.PropsWithChildren) {
  return <WagmiProvider>{children}</WagmiProvider>
}
