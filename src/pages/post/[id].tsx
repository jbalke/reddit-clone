import { Heading, Text } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import Wrapper from '../../components/Wrapper';
import { usePostQuery } from '../../generated/graphql';
import { getClientConfig } from '../../urql/urqlConfig';

function Post() {
  const router = useRouter();

  const [{ data, fetching }] = usePostQuery({
    variables: { id: router.query.id as string },
  });

  if (fetching) {
    return (
      <Layout>
        <Wrapper size="regular">
          <div>Loading...</div>
        </Wrapper>
      </Layout>
    );
  } else if (data && data.post) {
    const { post } = data;
    return (
      <Layout>
        <Wrapper size="regular">
          <Heading>{post.title}</Heading>
          <Text>{post.text}</Text>
        </Wrapper>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Wrapper size="regular">Could not find post.</Wrapper>
      </Layout>
    );
  }
}

export default withUrqlClient(getClientConfig, { ssr: true })(Post);
