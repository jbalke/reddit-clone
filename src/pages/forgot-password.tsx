import {
  FormControl,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { setAccessToken } from '../accessToken';
import InputField from '../components/InputField';
import { NextChakraLink } from '../components/NextChakraLink';
import Wrapper from '../components/Wrapper';
import { toErrorMap } from '../utils/toErrorMap';
import {
  validateForgotPasswordInput,
  validatePasswordInput,
} from '../utils/validate';
import { useForgotPasswordMutation } from '../generated/graphql';

type forgotPasswordProps = {};

function forgotPassword(props: forgotPasswordProps) {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [submitted, setSubmitted] = useState(false);

  return (
    <Wrapper size="small">
      {submitted ? (
        <Alert mt={5} status="success">
          <AlertIcon />
          <AlertTitle mr={4}>Success!</AlertTitle>
          <AlertDescription fontSize="sm">
            If an account with that email exists, an email has been sent.
          </AlertDescription>
        </Alert>
      ) : (
        <Formik
          initialValues={{
            email: '',
          }}
          validate={validateForgotPasswordInput}
          onSubmit={async (values) => {
            setSubmitted(false);
            const response = await forgotPassword({
              email: values.email,
            });
            if (response?.data) {
              setSubmitted(true);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormControl>
                <InputField
                  label="Email Address"
                  name="email"
                  placeholder="your email address"
                  type="email"
                  disabled={submitted}
                />
                <Button
                  mt={4}
                  isLoading={isSubmitting}
                  type="submit"
                  variantColor="teal"
                  isDisabled={submitted}
                >
                  forgot password
                </Button>
              </FormControl>
            </Form>
          )}
        </Formik>
      )}
    </Wrapper>
  );
}

export default forgotPassword;
