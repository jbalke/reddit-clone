import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Spinner,
  Text,
} from '@chakra-ui/core';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { clearAccessToken } from '../../../accessToken';
import Layout from '../../../components/Layout';
import { NextChakraLink } from '../../../components/NextChakraLink';
import {
  useLogoutMutation,
  useVerifyEmailMutation,
} from '../../../generated/graphql';

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
        <Spinner
          display="block"
          mx="auto"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
          size="xl"
        />
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

export default VerifyEmail;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: { userId: params!.uid, token: params!.token }, // will be passed to the page component as props
  };
};
