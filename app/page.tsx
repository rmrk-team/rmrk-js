"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { chainNameMapping } from "@/components/NFTRenderer/src/utils"

import { chains } from "../components/NFTRenderer/src/chains"
import { githubLink, lightmLink, rmrkLink } from "./links"

export default function Home() {
  const [selectedChain, setSelectedChain] = useState<string>()
  const [collectionId, setCollectionId] = useState<string>()
  const [tokenId, setTokenId] = useState<string>()

  return (
    <main className="flex min-h-screen flex-col items-center container py-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-32 w-full items-center justify-center gap-2">
          <span>Developed by</span>
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href={lightmLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/lightm.png"
              alt="Lightm Logo"
              className="dark:invert"
              width={64}
              height={64}
              priority
            />
            <span className="text-2xl tracking-tight">Lightm</span>
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-4 justify-center items-center flex-auto">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
          <Link href={rmrkLink} target="_blank">
            RMRK<sup>↗︎</sup>
          </Link>{" "}
          NFT Renderer
        </h1>
        <Link href={githubLink} target="_blank">
          <GitHubLogoIcon width={32} height={32} />
        </Link>

        <div className="relative flex max-md:flex-col justify-center items-center gap-4">
          <Select value={selectedChain} onValueChange={setSelectedChain}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select Chains..." />
            </SelectTrigger>
            <SelectContent>
              {chains.map((chain) => {
                return (
                  <SelectItem key={chain.id} value={chain.network}>
                    {chain.name}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {selectedChain ? (
            <>
              <Input
                placeholder="Collection ID"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
              />
              <Input
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
            </>
          ) : null}
          {selectedChain && collectionId && tokenId ? (
            <Link
              href={`${chainNameMapping[selectedChain]}/${collectionId}/${tokenId}`}
            >
              <Button>Go</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  )
}
