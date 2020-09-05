import React from 'react';
import { Form, Formik, FormikErrors, useFormik } from 'formik';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
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

type loginProps = {};

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

function login(props: loginProps) {
  const router = useRouter();
  const [, login] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      emailOrUsername: '',
      password: '',
    },
    validate,
    onSubmit: async (values, { setErrors }) => {
      const response = await login(values);
      if (response.data?.login.errors) {
        setErrors(toErrorMap(response.data.login.errors));
      } else if (response.data?.login.accessToken) {
        // succesfully registered
        router.push('/');
      }
    },
  });
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
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.accessToken) {
            // succesfully registered
            router.push('/');
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
                  <AlertTitle mr={2}>Login failed</AlertTitle>
                  <AlertDescription>Incorrect login details</AlertDescription>
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
