import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  Text,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { setAccessToken } from '../accessToken';
import InputField from '../components/InputField';
import { NextChakraLink } from '../components/NextChakraLink';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { validateLoginInput } from '../utils/validate';

type loginProps = {};

function login(props: loginProps) {
  const router = useRouter();
  const [, login] = useLoginMutation();
  const [loginError, setLoginError] = useState('');

  return (
    <Wrapper size="small">
      <Formik
        initialValues={{
          emailOrUsername: '',
          password: '',
        }}
        validate={validateLoginInput}
        onSubmit={async (values, { setErrors }) => {
          setLoginError('');
          const response = await login({
            options: {
              emailOrUsername: values.emailOrUsername,
              password: values.password,
            },
          });
          if (response && response.data) {
            const { login } = response.data;
            if (login.errors) {
              const errorMap = toErrorMap(login.errors);
              if ('login' in errorMap) {
                setLoginError(errorMap.login);
              }
              setErrors(toErrorMap(login.errors));
            } else if (login.accessToken) {
              // succesfully registered
              setAccessToken(login.accessToken);
              router.push('/');
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField
                label="Email or Username"
                name="emailOrUsername"
                placeholder="email address or username"
              />
              <Box mt={4}>
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="password"
                />
              </Box>
              <Flex justifyContent="space-between">
                <Button
                  mt={4}
                  isLoading={isSubmitting}
                  type="submit"
                  variantColor="teal"
                >
                  Login
                </Button>
                <Box mt={2}>
                  <NextChakraLink
                    fontSize="sm"
                    href="/forgot-password"
                    color="teal.500"
                  >
                    forgot password?
                  </NextChakraLink>
                </Box>
              </Flex>
              {!!loginError && (
                <Alert mt={5} status="error">
                  <AlertIcon />
                  <AlertTitle mr={2}>Login failed!</AlertTitle>
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default login;
