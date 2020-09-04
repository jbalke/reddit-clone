import React from 'react';
import { Form, Formik } from 'formik';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
  Button,
} from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

type registerProps = {};

function register(props: registerProps) {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper size="small">
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
        }}
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
  );
}

export default register;
