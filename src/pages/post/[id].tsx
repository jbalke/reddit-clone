import { Stack } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import { getClientConfig } from '../../urql/urqlConfig';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { useRouter } from 'next/router';

function Thread() {
  const router = useRouter();
  const { id } = router.query;
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
              opId={parseInt(id as string)}
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

export default withUrqlClient(getClientConfig, { ssr: true })(Thread);
