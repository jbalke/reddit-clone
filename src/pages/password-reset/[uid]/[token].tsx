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
import InputField from '../../../components/InputField';
import Wrapper from '../../../components/Wrapper';
import { useChangePasswordMutation } from '../../../generated/graphql';
import { toErrorMap } from '../../../utils/toErrorMap';
import { validatePasswordInput } from '../../../utils/validate';

interface Props {
  userId: string;
  token: string;
}

const PasswordReset = ({ userId, token }: Props) => {
  const [hasSubmitted, setSubmitted] = useState(false);
  const [{ data }, changePassword] = useChangePasswordMutation();
  const router = useRouter();

  return (
    <Wrapper size="small">
      <Formik
        initialValues={{
          password: '',
          form: '',
        }}
        validate={validatePasswordInput}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.password,
            token,
            userId,
          });
          if (response?.data) {
            setSubmitted(true);
            const { changePassword } = response.data;
            if (changePassword.errors) {
              setErrors(toErrorMap(changePassword.errors));
            }
          }
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <FormControl>
              <InputField
                label="New Password"
                name="password"
                placeholder="new password"
                type="password"
                disabled={hasSubmitted}
              />
              <Button
                mt={4}
                isLoading={isSubmitting}
                type="submit"
                variantColor="teal"
                isDisabled={hasSubmitted}
              >
                change password
              </Button>
              {errors.form && (
                <Alert mt={5} status="error">
                  <AlertIcon />
                  <AlertTitle mr={2}>Password reset failed</AlertTitle>
                  <AlertDescription>{errors.form}</AlertDescription>
                </Alert>
              )}
              {hasSubmitted && !errors.form && (
                <Alert mt={5} status="success">
                  <AlertIcon />
                  <AlertTitle mr={2}>Success!</AlertTitle>
                  <AlertDescription>
                    Your password has been changed.
                  </AlertDescription>
                </Alert>
              )}
            </FormControl>
          </Form>
        )}
      </Formik>
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

export default PasswordReset;
