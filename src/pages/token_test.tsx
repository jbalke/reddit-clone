import { Box } from '@chakra-ui/core';
import React from 'react';
import Header from '../components/Header';
import { useTestTokenQuery } from '../generated/graphql';

type token_testProps = {};

function token_test(props: token_testProps) {
  const [{ data, fetching, error }, rexecuteQuery] = useTestTokenQuery({
    requestPolicy: 'network-only',
  });

  return (
    <Box m={5}>
      <h2>Token Test</h2>
      {fetching && <p>Loading...</p>}
      {error && <p>Oh no... {error.message}</p>}
      {data && <pre>{JSON.stringify(data.token.jwt)}</pre>}
    </Box>
  );
}

export default token_test;
