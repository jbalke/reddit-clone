import { Box } from '@chakra-ui/core';
import React from 'react';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

type logoutProps = {};

function logout(props: logoutProps) {
  const [{ data, fetching, error }] = useMeQuery({ pause: isServer() });

  return (
    <Box m={5}>
      <div>Good bye! {data && <p>You are logged out.</p>}</div>
    </Box>
  );
}

export default logout;
