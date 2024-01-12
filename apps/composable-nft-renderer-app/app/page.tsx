'use client';

// import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { CollectionItem } from '@ark-ui/react';
import { EVM_NETWORKS, assertIsEvmNetwork } from '@rmrk-team/rmrk-evm-utils';
import { ValueChangeDetails } from '@zag-js/select';
import { InputSelect } from 'components/common/select';
import { Button } from 'components/park-ui/button';
import { Input } from 'components/park-ui/input';
import { rmrkLink } from 'lib/links';
import Link from 'next/link';
import React, { useState } from 'react';
import { Center, Container, HStack, Stack, VStack } from 'styled-system/jsx';
import Page from '../components/app/page';

const networkOptions = Object.values(EVM_NETWORKS).map((network) => ({
  label: network,
  value: network,
}));

export default function Home() {
  const [selectedNetwork, setSelectedNetwork] = useState<
    EVM_NETWORKS | undefined
  >();
  const [collectionId, setCollectionId] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');

  const changeNetwork = (item: ValueChangeDetails<CollectionItem>) => {
    console.log('item', item);
    assertIsEvmNetwork(item.value?.[0]);
    setSelectedNetwork(item.value?.[0]);
  };

  return (
    <Page>
      <VStack gap="8" width="100%" flex={1}>
        <Center>
          <HStack gap={4} mt={4} width="100%">
            <h1>
              <Link href={rmrkLink} target="_blank">
                RMRK<sup>↗︎</sup>
              </Link>{' '}
              NFT Renderer
            </h1>
            {/*<Link href={githubLink} target="_blank">*/}
            {/*  <GitHubLogoIcon width={32} height={32} />*/}
            {/*</Link>*/}
          </HStack>
        </Center>

        <Center flex={1}>
          <VStack gap="8">
            <InputSelect
              id="network"
              groupLabel="Network"
              placeholder="Select a network"
              onValueChange={changeNetwork}
              items={networkOptions}
            />

            {selectedNetwork ? (
              <VStack direction="vertical">
                <Stack gap="1.5" width="2xs">
                  <Input
                    id="collectionAddress"
                    placeholder="Collection address"
                    onChange={(e) => setCollectionId(e.target.value)}
                    value={collectionId}
                  />
                </Stack>

                <Stack gap="1.5" width="2xs">
                  <Input
                    id="tokenId"
                    placeholder="Token Id"
                    onChange={(e) => setTokenId(e.target.value)}
                    value={tokenId}
                  />
                </Stack>
              </VStack>
            ) : null}
            {selectedNetwork && collectionId && tokenId ? (
              <Container width="100%" paddingX={{ base: 0, md: 0, lg: 0 }}>
                <Link href={`${selectedNetwork}/${collectionId}/${tokenId}`}>
                  <Button width="100%">Go</Button>
                </Link>
              </Container>
            ) : null}
          </VStack>
        </Center>
      </VStack>
    </Page>
  );
}
