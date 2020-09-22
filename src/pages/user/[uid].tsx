import React from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Text } from '@chakra-ui/core';
import Wrapper from '../../components/Wrapper';
import Layout from '../../components/Layout';
import { getClientConfig } from '../../urql/urqlConfig';
import { withUrqlClient } from 'next-urql';

type ProfileProps = {};

function Profile(props: ProfileProps) {
  const router = useRouter();

  return (
    <Layout size="small">
      <Box>
        <Heading>Profile</Heading>
        <Text>UserId: {router.query.uid}</Text>
      </Box>
    </Layout>
  );
}

export default withUrqlClient(getClientConfig, { ssr: false })(Profile);
