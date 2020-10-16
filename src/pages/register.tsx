import { Box, Button, FormControl, FormHelperText } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { setAccessToken } from '../accessToken';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { validateRegisterInput } from '../utils/validate';

type registerProps = {};

function register(props: registerProps) {
  const router = useRouter();
  const [, registerMutation] = useRegisterMutation();
  return (
    <Layout size="small">
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validate={validateRegisterInput}
        onSubmit={async ({ username, email, password }, { setErrors }) => {
          const response = await registerMutation({
            options: { username, email, password },
          });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.accessToken) {
            // succesfully registered
            setAccessToken(response.data?.register.accessToken);
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
                type="email"
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
                <FormHelperText id="username-helper-text">
                  This is visible to other users.
                </FormHelperText>
              </Box>
              <Box mt={4}>
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="password"
                />
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="confirm password"
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
    </Layout>
  );
}
export default register;
