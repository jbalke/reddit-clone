import { Box, Heading, Spinner, Text } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import { useUserProfileQuery } from '../../generated/graphql';
import { relativeTime } from '../../utils/relativeTime';

type ProfileProps = {};

function Profile(props: ProfileProps) {
  const router = useRouter();

  const [{ data, fetching, stale }] = useUserProfileQuery({
    variables: { userId: router.query.uid as string },
  });

  if (!data && (fetching || stale)) {
    return (
      <Layout size="regular">
        <Box aria-busy="true">
          <Spinner
            display="block"
            mx="auto"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal.500"
            size="xl"
          />
        </Box>
      </Layout>
    );
  } else if (data?.userProfile) {
    return (
      <Layout size="regular">
        <Box aria-busy="false">
          <Heading>Profile for {data.userProfile.username}</Heading>
          <Text>Score: {data.userProfile.score}</Text>
          {data.userProfile.email && (
            <Text>email: {data.userProfile.email}</Text>
          )}
          {data.userProfile.verified !== null && (
            <Text>
              email verified: {data.userProfile.verified ? 'yes' : 'no'}
            </Text>
          )}
          <Text>
            last post:{' '}
            {data.userProfile.lastPostAt
              ? relativeTime(data.userProfile.lastPostAt)
              : 'never posted'}
          </Text>
          {data.userProfile.isAdmin && <Text>administrator</Text>}
          {data.userProfile.isBanned && (
            <Text color="red.500" fontWeight="bold" mt={2}>
              user currently banned for misconduct
            </Text>
          )}
        </Box>
      </Layout>
    );
  } else {
    <Layout size="regular">
      <Box aria-busy="false">
        <Text>Could not find user profile</Text>
      </Box>
    </Layout>;
  }
}

export default Profile;
