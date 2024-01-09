'use client';

import { useSearchParams } from 'next/navigation';
import { getChainIdByNetworkName } from '@lightm/nft-renderer/lib/get-chain-id-by-network-name';
import { assertIsEvmNetwork } from '@lightm/nft-renderer/lib/get-is-evm-network';
import NFTRenderer from '@lightm/nft-renderer/components/nft-renderer';
import { Center, Flex } from 'styled-system/jsx';

export default function TokenDisplay({
  params,
}: {
  params: { chain: string; collection: `0x${string}`; tokenId: string };
}) {
  const { chain, collection, tokenId } = params;
  assertIsEvmNetwork(chain);
  const searchParams = useSearchParams();
  const advancedMode = searchParams.get('advancedMode') === 'true';
  const emoteMode = searchParams.get('emoteMode') === 'true';

  const chainId = getChainIdByNetworkName(chain);

  return (
    <Flex height="100vh" width="100vw">
      <Flex height="100vh" aspectRatio={'1/1'} margin="0 auto">
        <NFTRenderer
          chainId={chainId}
          contractAddress={collection}
          tokenId={tokenId}
          advancedMode={advancedMode}
          emoteMode={emoteMode}
        />
      </Flex>
    </Flex>
  );
}
