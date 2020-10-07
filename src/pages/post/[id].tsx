import { Stack } from '@chakra-ui/core';
import React from 'react';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

function Thread() {
  const [{ data, fetching }] = useGetPostFromUrl(10);

  if (fetching) {
    return (
      <Layout size="regular">
        <div>Loading...</div>
      </Layout>
    );
  } else if (data && data.thread) {
    return (
      <Layout size="regular">
        <Stack spacing={0}>
          {data.thread.map((p) => (
            <Post
              key={p.id}
              post={p}
              shadow={!p.level ? 'md' : undefined}
              borderWidth="1px"
              ml={p.level * 4}
              borderLeft={p.level ? `2px solid teal` : undefined}
            />
          ))}
        </Stack>
      </Layout>
    );
  } else {
    return (
      <Layout size="regular">
        <div>Could not find post.</div>
      </Layout>
    );
  }
}

export default Thread;
