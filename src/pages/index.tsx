import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/core';
import { useState } from 'react';
import Feature from '../components/Feature';
import { NextChakraLink } from '../components/NextChakraLink';
import Wrapper from '../components/Wrapper';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: undefined as undefined | string,
  });
  const [{ data, fetching, stale }] = usePostsQuery({ variables });

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
        {!data && (fetching || stale) ? (
          <div>loading...</div>
        ) : (
          <Stack spacing={8}>
            {data &&
              data.posts.posts.map((p) => (
                <Feature
                  key={p.id}
                  title={p.title}
                  text={p.textSnippet}
                  author={p.author}
                  points={p.points}
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
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching || stale}
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
