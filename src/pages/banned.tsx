import React from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Text } from '@chakra-ui/core';
import Layout from '../components/Layout';
import { getClientConfig } from '../urql/urqlConfig';
import { withUrqlClient } from 'next-urql';

type BannedProps = {};

function Banned(props: BannedProps) {
  return (
    <Layout size="regular">
      <Box>
        <Heading mb={4}>Someone has been making waves...</Heading>
        <Text>Go cool off for a bit, maybe check back in tomorrow...</Text>
      </Box>
    </Layout>
  );
}

export default Banned;
