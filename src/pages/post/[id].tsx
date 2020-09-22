import { Heading, Text } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import Layout from '../../components/Layout';
import Wrapper from '../../components/Wrapper';
import { useMeQuery } from '../../generated/graphql';
import { getClientConfig } from '../../urql/urqlConfig';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

function Post() {
  const router = useRouter();

  const [{ data: meData, fetching: meFetching }] = useMeQuery();
  const [{ data, fetching }] = useGetPostFromUrl();

  if (fetching) {
    return (
      <Layout size="regular">
        <div>Loading...</div>
      </Layout>
    );
  } else if (data && data.post) {
    const { post } = data;
    return (
      <Layout size="regular">
        <Heading>{post.title}</Heading>
        <Text>{post.text}</Text>
        {meData?.me?.id === post.author.id && (
          <EditDeletePostButtons
            postId={post.id}
            mt={4}
            display="flex"
            justifyContent="flex-end"
          />
        )}
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

export default withUrqlClient(getClientConfig, { ssr: true })(Post);
