import { Link } from 'components/park-ui/link';
import { Text } from 'components/park-ui/text';
import Image from 'next/image';
import React from 'react';
import { Center, Flex, HStack } from 'styled-system/jsx';
import { lightmLink } from '../../lib/links';

export const Footer = () => {
  return (
    <Center py={4}>
      <HStack gap={2}>
        {/*<Flex>Developed by</Flex>*/}
        {/*<Link target="_blank" href={lightmLink} rel="noopener noreferrer">*/}
        {/*  <Image*/}
        {/*    src="/lightm.png"*/}
        {/*    alt="Lightm Logo"*/}
        {/*    className="dark:invert"*/}
        {/*    width={64}*/}
        {/*    height={64}*/}
        {/*    priority*/}
        {/*  />*/}
        {/*  <Text>Lightm</Text>*/}
        {/*</Link>*/}
      </HStack>
    </Center>
  );
};
