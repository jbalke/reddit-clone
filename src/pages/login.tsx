import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { setAccessToken } from '../accessToken';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { validateLoginInput } from '../utils/validate';

type loginProps = {};

function login(props: loginProps) {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper size="small">
      <Formik
        initialValues={{
          emailOrUsername: '',
          password: '',
          form: '',
        }}
        validate={validateLoginInput}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            options: {
              emailOrUsername: values.emailOrUsername,
              password: values.password,
            },
          });
          if (response && response.data) {
            const { login } = response.data;
            if (login.errors) {
              setErrors(toErrorMap(login.errors));
            } else if (login.accessToken) {
              // succesfully registered
              setAccessToken(login.accessToken);
              router.push('/');
            }
          }
        }}
      >
        {({ isSubmitting, errors }) => (
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
              <Button
                mt={4}
                isLoading={isSubmitting}
                type="submit"
                variantColor="teal"
              >
                Login
              </Button>
              {errors.form && (
                <Alert mt={5} status="error">
                  <AlertIcon />
                  <AlertTitle mr={2}>Login failed!</AlertTitle>
                  <AlertDescription>{errors.form}</AlertDescription>
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
