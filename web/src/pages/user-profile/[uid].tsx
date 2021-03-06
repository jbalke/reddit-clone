import {
  Badge,
  Box,
  Flex,
  Heading,
  Icon,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import AdminUserControls from '../../components/AdminUserControls';
import Layout from '../../components/Layout';
import { useMeQuery, useUserProfileQuery } from '../../generated/graphql';
import {
  formatTimeStamp,
  formatTimeStampFull,
} from '../../utils/formatTimeStamp';
import { relativeTime } from '../../utils/relativeTime';

type ProfileProps = {};

function Profile(props: ProfileProps) {
  const router = useRouter();

  const [{ data: meData, fetching: meFetching }] = useMeQuery();
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
          <Flex flexDirection="column" mb={4}>
            <Heading>Profile for {data.userProfile.username}</Heading>
            <Stack isInline spacing={1}>
              {data.userProfile.isAdmin && (
                <Badge
                  variant="outline"
                  alignSelf="flex-start"
                  variantColor="teal"
                >
                  administrator
                </Badge>
              )}
              {data.userProfile.verified ? (
                <Badge
                  variant="outline"
                  alignSelf="flex-start"
                  variantColor="green"
                >
                  verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  alignSelf="flex-start"
                  variantColor="orange"
                >
                  not verified
                </Badge>
              )}
              {data.userProfile.bannedUntil && (
                <Badge
                  variant="outline"
                  alignSelf="flex-start"
                  variantColor="red"
                >
                  banned
                </Badge>
              )}
            </Stack>
          </Flex>
          <Text>score: {data.userProfile.score}</Text>
          {data.userProfile.email && (
            <Text>email: {data.userProfile.email}</Text>
          )}
          <Text>
            last active:{' '}
            {data.userProfile.lastActiveAt
              ? relativeTime(data.userProfile.lastActiveAt)
              : 'never posted'}
          </Text>
          <Text>
            member since: {formatTimeStamp(data.userProfile.createdAt)}
          </Text>
          {data.userProfile.bannedUntil && (
            <Text>
              banned until: {formatTimeStampFull(data.userProfile.bannedUntil)}
              <Link href="/banned">
                <Icon
                  ml={2}
                  name="question"
                  color="teal.500"
                  cursor="pointer"
                />
              </Link>
            </Text>
          )}
          {meData?.me?.isAdmin && !data.userProfile.isAdmin && (
            <AdminUserControls user={data.userProfile} />
          )}
        </Box>
      </Layout>
    );
  } else {
    <Layout size="regular">
      <Box aria-busy="false">
        <Text>Could not find user</Text>
      </Box>
    </Layout>;
  }
}

export default Profile;
