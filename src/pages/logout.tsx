import React from 'react';
import { useMeQuery } from '../generated/graphql';

type logoutProps = {};

function logout(props: logoutProps) {
  const [{ data, fetching, error }] = useMeQuery();

  return <div>Good bye! {!fetching && <p>You are logged out.</p>}</div>;
}

export default logout;
