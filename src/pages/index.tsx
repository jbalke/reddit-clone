import { Box, Stack, Flex, Heading, Button } from '@chakra-ui/core';
import { Post, usePostsQuery } from '../generated/graphql';
import Feature from '../components/Feature';
import Wrapper from '../components/Wrapper';
import { NextChakraLink } from '../components/NextChakraLink';
import { useState } from 'react';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) {
    return <div>Could not retrieve any posts.</div>;
  }

  return (
    <Wrapper size="regular">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading>Reddit Clone</Heading>
        <NextChakraLink href="/create-post">create post</NextChakraLink>
      </Flex>
      <br />
      <Box>
        {!data && fetching ? (
          <div>loading...</div>
        ) : (
          <Stack spacing={8}>
            {data &&
              data.posts.posts.map((p) => (
                <Feature
                  key={p.id}
                  title={p.title}
                  text={p.textSnippet}
                  date={p.createdAt}
                ></Feature>
              ))}
          </Stack>
        )}
      </Box>
      {data && data.posts.hasMore && (
        <Flex justifyContent="center" alignItems="center">
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1]
                  .createdAt as string,
              });
            }}
            my={8}
          >
            load more
          </Button>
        </Flex>
      )}
    </Wrapper>
  );
};

export default Index;
