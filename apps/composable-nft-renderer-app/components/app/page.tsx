import React, { type FunctionComponent, type PropsWithChildren } from 'react';
import { Flex } from 'styled-system/jsx';
import { Footer } from './footer';

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
