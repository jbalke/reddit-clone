import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { setAccessToken } from '../../../accessToken';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import { NextChakraLink } from '../../../components/NextChakraLink';
import Wrapper from '../../../components/Wrapper';
import { useChangePasswordMutation } from '../../../generated/graphql';
import { getClientConfig } from '../../../urql/urqlConfig';
import { toErrorMap } from '../../../utils/toErrorMap';
import { validatePasswordInput } from '../../../utils/validate';

const ChangePassword = () => {
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  return (
    <Layout size="small">
      {!!tokenError ? (
        <Alert mt={5} status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Token expired</AlertTitle>
          <AlertDescription>
            <NextChakraLink href="/forgot-password">
              click here to get a new one
            </NextChakraLink>
          </AlertDescription>
        </Alert>
      ) : submitted ? (
        <Alert mt={5} status="success">
          <AlertIcon />
          <AlertTitle mr={4}>Success!</AlertTitle>
          {/* <AlertDescription>Your password has been changed.</AlertDescription> */}
        </Alert>
      ) : (
        <Formik
          initialValues={{
            password: '',
          }}
          validate={validatePasswordInput}
          onSubmit={async (values) => {
            const response = await changePassword({
              newPassword: values.password,
              token:
                typeof router.query.token == 'string' ? router.query.token : '',
              userId:
                typeof router.query.uid == 'string' ? router.query.uid : '',
            });
            if (response?.data) {
              const { changePassword } = response.data;
              if (changePassword.errors) {
                const errorMap = toErrorMap(changePassword.errors);
                if ('token' in errorMap) {
                  setTokenError(errorMap.token);
                }
                setSubmitted(true);
              } else if (response.data.changePassword.accessToken) {
                setAccessToken(response.data.changePassword.accessToken);
                router.push('/');
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormControl>
                <InputField
                  label="New Password"
                  name="password"
                  placeholder="new password"
                  type="password"
                  disabled={!!tokenError}
                />
                <Button
                  mt={4}
                  isLoading={isSubmitting}
                  type="submit"
                  variantColor="teal"
                  isDisabled={!!tokenError}
                >
                  change password
                </Button>
              </FormControl>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default withUrqlClient(getClientConfig, { ssr: false })(ChangePassword);
