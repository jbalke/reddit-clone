import { Box, Button, Flex, Spinner, Stack } from '@chakra-ui/core';
import Link from 'next/link';
import { useContext, useReducer } from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import SortControls from '../components/SortControls';
import { Sort, SortBy, usePostsQuery } from '../generated/graphql';
import { MyContext } from '../myContext';
import { reducer } from '../state/posts';

type PageProps = {};

const Index = ({}: PageProps) => {
  const { secondsUntilNewPost } = useContext(MyContext);

  const [state, dispatch] = useReducer(reducer, {
    limit: 20,
    cursor: undefined,
    sortOptions: { sortBy: SortBy.Age, sortDirection: Sort.Desc },
  });

  const [{ data, fetching, stale }] = usePostsQuery({
    variables: {
      options: {
        limit: state.limit,
        cursor: state.cursor,
        sortOptions: state.sortOptions,
      },
    },
    requestPolicy: 'cache-and-network',
  });
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
              <Flex>
                <SortControls dispatch={dispatch} />
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
              </Flex>
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
                dispatch({
                  type: 'SET_CURSOR',
                  payload: {
                    lastPost: data.posts.posts[data.posts.posts.length - 1],
                  },
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
