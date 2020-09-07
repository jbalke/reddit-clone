import React from 'react';
import { Form, Formik } from 'formik';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  Button,
  FormHelperText,
} from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { emailRE } from '../constants';
import Header from '../components/Header';

type registerProps = {};

interface Credentials {
  username: string;
  email: string;
  password: string;
}
const validate = (values: Credentials) => {
  const errors: any = {};
  if (!values.username) {
    errors.username = 'Required';
  } else if (values.username.length < 3) {
    errors.username = 'Must be 3 characters or more';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!emailRE.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length <= 6) {
    errors.password = 'Password length must be greater than 6';
  }
  return errors;
};

function register(props: registerProps) {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <>
      <Header />
      <Wrapper size="small">
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
          }}
          validate={validate}
          onSubmit={async (values, { setErrors }) => {
            const response = await register(values);
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              // succesfully registered
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormControl>
                <InputField
                  label="Email"
                  name="email"
                  placeholder="email address"
                />
                <FormHelperText id="email-helper-text">
                  We'll never share your email.
                </FormHelperText>
                <Box mt={4}>
                  <InputField
                    label="Username"
                    name="username"
                    placeholder="username"
                  />
                </Box>
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
                  Register
                </Button>
                {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
              </FormControl>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
}

export default register;
