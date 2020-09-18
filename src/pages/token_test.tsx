import { Box } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import Layout from '../components/Layout';
import { useTestTokenQuery } from '../generated/graphql';
import { getClientConfig } from '../urql/urqlConfig';

type token_testProps = {};

function token_test(props: token_testProps) {
  const [{ data, fetching, error }] = useTestTokenQuery();

  return (
    <Layout>
      <Box m={5}>
        <h2>Token Test</h2>
        {fetching && <p>Loading...</p>}
        {error && <p>Oh no... {error.message}</p>}
        {data && <pre>{JSON.stringify(data.token.jwt)}</pre>}
      </Box>
    </Layout>
  );
}

export default withUrqlClient(getClientConfig)(token_test);
