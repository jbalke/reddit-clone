import { Box, Button, FormControl, FormHelperText } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { setAccessToken } from '../accessToken';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { getClientConfig } from '../urql/urqlConfig';
import { toErrorMap } from '../utils/toErrorMap';
import { validateRegisterInput } from '../utils/validate';

type registerProps = {};

function register(props: registerProps) {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Layout>
      <Wrapper size="small">
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
          }}
          validate={validateRegisterInput}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({
              options: values,
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
    </Layout>
  );
}
export default withUrqlClient(getClientConfig)(register);
