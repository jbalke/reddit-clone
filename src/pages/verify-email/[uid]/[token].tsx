import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Text,
} from '@chakra-ui/core';
import { GetServerSideProps } from 'next';
import { withUrqlClient } from 'next-urql';
import React, { useEffect } from 'react';
import { clearAccessToken } from '../../../accessToken';
import Layout from '../../../components/Layout';
import { NextChakraLink } from '../../../components/NextChakraLink';
import {
  useLogoutMutation,
  useVerifyEmailMutation,
} from '../../../generated/graphql';
import { getClientConfig } from '../../../urql/urqlConfig';
import { useRouter } from 'next/router';

type VerifyEmailProps = {
  userId: string;
  token: string;
};

function VerifyEmail({ userId, token }: VerifyEmailProps) {
  const [{ data, fetching }, verifyEmail] = useVerifyEmailMutation();
  const [, logout] = useLogoutMutation();
  const router = useRouter();

  useEffect(() => {
    verifyEmail({ userId, token }).then((result) => {
      if (result.data?.verifyEmail.verified) {
        logout().then(() => {
          clearAccessToken();
          router.push('/login');
        });
      }
    });
  }, []);

  if (fetching) {
    return (
      <Layout size="small">
        <Text>verifying...</Text>
      </Layout>
    );
  } else if (data?.verifyEmail.verified) {
    return (
      <Layout size="small">
        <Alert mt={5} status="success">
          <AlertIcon />
          <AlertTitle mr={4}>Success!</AlertTitle>
          <AlertDescription>
            Your email address has been verified. You must now log back in.
          </AlertDescription>
        </Alert>
      </Layout>
    );
  } else {
    return (
      <Layout size="small">
        <Alert mt={5} status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Token expired</AlertTitle>
          <AlertDescription>
            <NextChakraLink href="/resend-verification">
              click here to get a new one
            </NextChakraLink>
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }
}

export default withUrqlClient(getClientConfig)(VerifyEmail);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: { userId: params!.uid, token: params!.token }, // will be passed to the page component as props
  };
};
