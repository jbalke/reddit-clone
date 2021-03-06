import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useForgotPasswordMutation } from '../generated/graphql';
import { validateEmailInput } from '../utils/validate';

type forgotPasswordProps = {};

function forgotPassword(props: forgotPasswordProps) {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [submitted, setSubmitted] = useState(false);

  return (
    <Layout size="small">
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
          validate={validateEmailInput}
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
                  isDisabled={submitted}
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
    </Layout>
  );
}

export default forgotPassword;
