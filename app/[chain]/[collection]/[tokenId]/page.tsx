"use client"

import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"

import { chains } from "@/components/NFTRenderer/chains"
import { chainNameMapping } from "@/components/NFTRenderer/utils"

const NFTRenderer = dynamic(
  async () => (await import("../../../../components/NFTRenderer")).NFTRenderer,
  { ssr: false }
)

export default function TokenDisplay({
  params,
}: {
  params: { chain: string; collection: `0x${string}`; tokenId: string }
}) {
  const { chain, collection, tokenId } = params
  const searchParams = useSearchParams()
  const advancedMode = searchParams.get("advancedMode") === "true"

  const chainId = chains.find(
    (_chain) => _chain.network === chainNameMapping[chain]
  )?.id

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <NFTRenderer
        chainId={chainId}
        collection={collection}
        tokenId={tokenId}
        advancedMode={advancedMode}
      />
    </div>
  )
}
