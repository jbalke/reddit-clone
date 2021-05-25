import { Flex, Box, Button, Spinner, Stack } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import { useContext, useEffect, useReducer, useRef } from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import SortControls from '../components/SortControls';
import { Sort, SortBy, usePostsQuery } from '../generated/graphql';
import { MyContext } from '../myContext';
import { reducer } from '../state/posts';
import { getClientConfig } from '../urql/urqlConfig';

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

  // const loaderRef = useRef(null);

  useEffect(() => {
    const targetRef = document.getElementById('target');
    if (!targetRef || !data || !data.posts.hasMore) return;

    const options = {
      root: null,
      rootMargin: '0px',
      thresholds: 1,
    };
    const observer = new IntersectionObserver(() => {
      dispatch({
        type: 'SET_CURSOR',
        payload: {
          lastPost: data.posts.posts[data.posts.posts.length - 1],
        },
      });
    }, options);

    observer.observe(targetRef);
    return () => {
      observer.unobserve(targetRef);
    };
  }, [data]);

  return (
    <>
      <Layout size='regular'>
        <Box aria-busy={!data && (fetching || stale)} mb='5rem'>
          {!data && (fetching || stale) ? (
            <Spinner
              display='block'
              mx='auto'
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='teal.500'
              size='xl'
            />
          ) : (
            <Flex direction='column'>
              <Flex justifyContent='space-between' alignItems='center' mb={4}>
                <SortControls dispatch={dispatch} />
                <Link href='/create-post'>
                  <Button
                    width={90}
                    variantColor='teal'
                    aria-label='new post'
                    isDisabled={secondsUntilNewPost ? true : false}
                    title='new post'
                  >
                    {secondsUntilNewPost ? secondsUntilNewPost : 'new post'}
                  </Button>
                </Link>
              </Flex>
              <Stack spacing={4}>
                {data &&
                  data.posts.posts.map((p) => (
                    <Post
                      key={p.id}
                      post={p}
                      p={2}
                      shadow='md'
                      borderWidth='1px'
                    />
                  ))}
              </Stack>
            </Flex>
          )}
          <Flex justifyContent='center' mt={4} id='target'>
            {data && data.posts.hasMore && (
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
              >
                load more
              </Button>
            )}
          </Flex>
        </Box>
      </Layout>
    </>
  );
};

export default withUrqlClient(getClientConfig, { ssr: true })(Index);
