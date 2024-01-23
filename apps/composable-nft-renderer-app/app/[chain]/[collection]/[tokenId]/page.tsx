'use client';

import { NFTRenderer } from '@rmrk-team/nft-renderer';
import {
  assertIsEvmNetwork,
  getChainIdByNetworkName,
} from '@rmrk-team/rmrk-evm-utils';
import { Loader } from 'components/common/loader';
import { useSearchParams } from 'next/navigation';
import { Flex } from 'styled-system/jsx';

export default function TokenDisplay({
  params,
}: {
  params: { chain: string; collection: `0x${string}`; tokenId: string };
}) {
  const { chain, collection, tokenId } = params;
  assertIsEvmNetwork(chain);
  const searchParams = useSearchParams();
  const advancedMode = searchParams.get('advancedMode') === 'true';

  const chainId = getChainIdByNetworkName(chain);

  return (
    <Flex height="100vh" width="100vw">
      <Flex height="100vh" aspectRatio={'1/1'} margin="0 auto">
        <NFTRenderer
          chainId={chainId}
          contractAddress={collection}
          tokenId={BigInt(tokenId)}
          advancedMode={advancedMode}
          loader={<Loader />}
        />
      </Flex>
    </Flex>
  );
}
