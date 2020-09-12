import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { setAccessToken } from '../../../accessToken';
import InputField from '../../../components/InputField';
import { NextChakraLink } from '../../../components/NextChakraLink';
import Wrapper from '../../../components/Wrapper';
import { useChangePasswordMutation } from '../../../generated/graphql';
import { toErrorMap } from '../../../utils/toErrorMap';
import { validatePasswordInput } from '../../../utils/validate';

interface Props {
  userId: string;
  token: string;
}

const ChangePassword = ({ userId, token }: Props) => {
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  return (
    <Wrapper size="small">
      {!!tokenError ? (
        <Alert mt={5} status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Token expired</AlertTitle>
          <AlertDescription>
            <NextChakraLink href="/forgot-password">
              click here to get a new one
            </NextChakraLink>
          </AlertDescription>
        </Alert>
      ) : submitted ? (
        <Alert mt={5} status="success">
          <AlertIcon />
          <AlertTitle mr={4}>Success!</AlertTitle>
          {/* <AlertDescription>Your password has been changed.</AlertDescription> */}
        </Alert>
      ) : (
        <Formik
          initialValues={{
            password: '',
          }}
          validate={validatePasswordInput}
          onSubmit={async (values) => {
            const response = await changePassword({
              newPassword: values.password,
              token,
              userId,
            });
            if (response?.data) {
              const { changePassword } = response.data;
              if (changePassword.errors) {
                const errorMap = toErrorMap(changePassword.errors);
                if ('token' in errorMap) {
                  setTokenError(errorMap.token);
                }
                setSubmitted(true);
              } else if (response.data.changePassword.accessToken) {
                setAccessToken(response.data.changePassword.accessToken);
                router.push('/');
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormControl>
                <InputField
                  label="New Password"
                  name="password"
                  placeholder="new password"
                  type="password"
                  disabled={!!tokenError}
                />
                <Button
                  mt={4}
                  isLoading={isSubmitting}
                  type="submit"
                  variantColor="teal"
                  isDisabled={!!tokenError}
                >
                  change password
                </Button>
              </FormControl>
            </Form>
          )}
        </Formik>
      )}
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  return {
    props: {
      userId: query.uid as string,
      token: query.token as string,
    },
  };
};

export default ChangePassword;
