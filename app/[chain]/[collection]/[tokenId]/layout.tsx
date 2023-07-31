import WagmiProvider from "@/app/wagmiProvider";

export default function RendererLayout({ children }: React.PropsWithChildren) {
  return <WagmiProvider>{children}</WagmiProvider>;
}
