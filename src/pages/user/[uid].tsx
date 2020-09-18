import React from 'react';
import { useRouter } from 'next/router';
import { Box, Heading, Text } from '@chakra-ui/core';
import Wrapper from '../../components/Wrapper';
import Layout from '../../components/Layout';

type ProfileProps = {};

function Profile(props: ProfileProps) {
  const router = useRouter();

  return (
    <Layout>
      <Wrapper size="regular">
        <Box>
          <Heading>Profile</Heading>
          <Text>UserId: {router.query.uid}</Text>
        </Box>
      </Wrapper>
    </Layout>
  );
}

export default Profile;
