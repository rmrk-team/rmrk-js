import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Footer } from './footer';
import { Container, Flex } from 'styled-system/jsx';

const Page: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Flex
        mb={4}
        direction="column"
        flexGrow={1}
        marginX={'auto'}
        paddingX={{ base: 4, md: 6, lg: 8 }}
        maxWidth="1600px"
        width="100%"
      >
        {children}
      </Flex>
      <Footer />
    </>
  );
};

export default Page;
