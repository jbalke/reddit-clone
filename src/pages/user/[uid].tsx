import { Box, Heading, Text } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';

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

export default Profile;
