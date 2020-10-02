import { Box, Button, Flex, Stack } from '@chakra-ui/core';
import { useState } from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import { usePostsQuery } from '../generated/graphql';

type PageProps = {};

const Index = ({}: PageProps) => {
  const [variables, setVariables] = useState<{
    limit: number;
    cursor: string | undefined;
  }>({
    limit: 20,
    cursor: undefined,
  });
  const [{ data, fetching, stale }] = usePostsQuery({ variables });

  if (!fetching && !data) {
    return <div>Could not retrieve any posts.</div>;
  }

  return (
    <Layout size="regular">
      <Box>
        {!data && (fetching || stale) ? (
          <div>loading...</div>
        ) : (
          <Stack>
            {data &&
              data.posts.posts.map((p) => (
                <Post key={p.id} post={p} p={5} shadow="md" borderWidth="1px" />
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
            my={4}
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default Index;
