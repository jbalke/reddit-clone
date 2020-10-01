import { Box, Heading, Text } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import { getClientConfig } from '../../urql/urqlConfig';

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
