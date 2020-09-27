import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  Heading,
  Text,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useSendVerifyEmailMutation } from '../generated/graphql';
import { getClientConfig } from '../urql/urqlConfig';
import { validateEmailInput } from '../utils/validate';

type resendVerificationProps = {};

function ResendVerification(props: resendVerificationProps) {
  const [submitted, setSubmitted] = useState(false);
  const [, sendVerificationEmail] = useSendVerifyEmailMutation();

  return (
    <Layout size="regular">
      <Heading mb={4}>Email Verification</Heading>
      <Text>
        If you have yet to verify your email address, your access to this site
        will be restricted. After registration and when changing the your email
        address, an email will have been sent with a link to verify the email
        address you provided (please check your junk/spam folder).
      </Text>
      <Text mt={2} mb={4}>
        If you would like to send another verification email, enter the email
        address you registered with below.
      </Text>

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
            const response = await sendVerificationEmail({
              email: values.email,
            });
            if (response.data) {
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
                  placeholder="your registered email address"
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
                  send verification
                </Button>
              </FormControl>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
}

export default withUrqlClient(getClientConfig)(ResendVerification);
