import { Box, Button, Flex, Stack, Spinner } from '@chakra-ui/core';
import Link from 'next/link';
import { useContext, useState } from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import { usePostsQuery } from '../generated/graphql';
import { MyContext } from '../myContext';

type PageProps = {};

const Index = ({}: PageProps) => {
  const { secondsUntilNewPost } = useContext(MyContext);

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
    <>
      <Layout size="regular">
        <Box aria-busy={!data && (fetching || stale)}>
          {!data && (fetching || stale) ? (
            <Spinner
              display="block"
              mx="auto"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="teal.500"
              size="xl"
            />
          ) : (
            <Stack>
              <Link href="/create-post">
                <Button
                  width={90}
                  mb={4}
                  ml="auto"
                  variantColor="teal"
                  aria-label="new post"
                  isDisabled={secondsUntilNewPost ? true : false}
                  title="new post"
                >
                  {secondsUntilNewPost ? secondsUntilNewPost : 'new post'}
                </Button>
              </Link>
              {data &&
                data.posts.posts.map((p) => (
                  <Post
                    key={p.id}
                    post={p}
                    p={2}
                    shadow="md"
                    borderWidth="1px"
                  />
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
      </Layout>
    </>
  );
};

export default Index;
