"use client"

import WalletProvider from "@/components/NFTRenderer/src/walletProvider"

export default function RendererLayout({ children }: React.PropsWithChildren) {
  return <WalletProvider>{children}</WalletProvider>
}
