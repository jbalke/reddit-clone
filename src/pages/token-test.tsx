import { Box } from '@chakra-ui/core';
import React from 'react';
import Layout from '../components/Layout';
import { useTestTokenQuery } from '../generated/graphql';

type token_testProps = {};

function token_test(props: token_testProps) {
  const [{ data, fetching, error }] = useTestTokenQuery({
    requestPolicy: 'network-only',
  });

  return (
    <Layout size="regular">
      <Box>
        <h2>Token Test</h2>
        {fetching && <p>Loading...</p>}
        {error && <p>Oh no... {error.message}</p>}
        {data && <pre>{JSON.stringify(data.token.jwt)}</pre>}
      </Box>
    </Layout>
  );
}

export default token_test;
