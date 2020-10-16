import { Box, Heading, Text } from '@chakra-ui/core';
import React from 'react';
import Layout from '../components/Layout';

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
