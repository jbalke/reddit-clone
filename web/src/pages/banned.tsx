import { Box, Heading, Text, List, ListItem } from '@chakra-ui/core';
import { NextUrqlPageContext } from 'next-urql';
import React from 'react';
import Layout from '../components/Layout';
import { MeQuery } from '../generated/graphql';
import { formatTimeStampFull } from '../utils/formatTimeStamp';

type BannedProps = { bannedUntil: Date };

function Banned({ bannedUntil }: BannedProps) {
  if (bannedUntil) {
    return (
      <Layout size="regular">
        <Box>
          <Heading mb={4}>Someone has been making waves...</Heading>
          <Text>
            You have been banned until {formatTimeStampFull(bannedUntil)}.
          </Text>
          <Text mt={2} mb={1}>
            {' '}
            Until then, you may not do the following:
          </Text>
          <List styleType="disc" spacing={1} ml={4}>
            <ListItem>create posts</ListItem>
            <ListItem>reply to posts</ListItem>
            <ListItem>edit or delete any of your posts/replies</ListItem>
            <ListItem>vote</ListItem>
          </List>
        </Box>
      </Layout>
    );
  } else {
    return (
      <Layout size="regular">
        <Box>
          <Heading mb={4}>Why would you think that you're banned?</Heading>
          <Text>We love you... honestly.</Text>
        </Box>
      </Layout>
    );
  }
}

Banned.getInitialProps = async ({ urqlClient }: NextUrqlPageContext) => {
  let result;
  try {
    result = await urqlClient
      .query<MeQuery>(
        `
      {
        me {
          bannedUntil
        }
      }
      `
      )
      .toPromise();

    return { bannedUntil: result.data?.me?.bannedUntil };
  } catch (err) {
    console.error(err);
    return {};
  }
};

export default Banned;
