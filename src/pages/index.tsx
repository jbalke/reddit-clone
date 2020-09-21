import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { useState } from 'react';
import Layout from '../components/Layout';
import { NextChakraLink } from '../components/NextChakraLink';
import PostSummary from '../components/PostSummary';
import Wrapper from '../components/Wrapper';
import { usePostsQuery } from '../generated/graphql';
import { getClientConfig } from '../urql/urqlConfig';

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
    <Layout>
      <Wrapper size="regular">
        <Box>
          {!data && (fetching || stale) ? (
            <div>loading...</div>
          ) : (
            <Stack>
              {data &&
                data.posts.posts.map((p) => (
                  <PostSummary key={p.id} post={p}></PostSummary>
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
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
              isLoading={fetching || stale}
              my={4}
            >
              load more
            </Button>
          </Flex>
        )}
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(getClientConfig, { ssr: true })(Index);
