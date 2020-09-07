import React from 'react';
import { Form, Formik, FormikErrors } from 'formik';
import {
  FormControl,
  Box,
  Button,
  AlertDescription,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { emailRE } from '../constants';
import { setAccessToken } from '../accessToken';
import Header from '../components/Header';

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
        validate={validate}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            options: {
              emailOrUsername: values.emailOrUsername,
              password: values.password,
            },
          }); //* compare login.graphql and register.graphql for different ways to declare mutation/query variables
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

interface Credentials {
  emailOrUsername: string;
  password: string;
}
const validate = (values: any) => {
  const errors: FormikErrors<Credentials> = {};

  if (!values.emailOrUsername) {
    errors.emailOrUsername = 'Required';
  } else if (
    !emailRE.test(values.emailOrUsername) &&
    values.emailOrUsername.length < 3
  ) {
    errors.emailOrUsername = 'Username must be 3 characters or more';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length <= 6) {
    errors.password = 'Password length must be greater than 6';
  }
  return errors;
};

export default login;
