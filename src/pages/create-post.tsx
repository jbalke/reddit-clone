import { Box, Button, Flex, FormControl } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { AuthGuardSSR } from '../urql/authGuardSSR';
import { getClientConfig } from '../urql/urqlConfig';
import { useIsAuthenticatedAndVerified } from '../utils/useIsAuthenticatedAndVerified';
import { validatePostInput } from '../utils/validate';

type PageProps = {};

function CreatePost(props: PageProps) {
  useIsAuthenticatedAndVerified();

  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  return (
    <Layout size="small">
      <Formik
        initialValues={{
          title: '',
          text: '',
        }}
        validate={validatePostInput}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField label="Title" name="title" placeholder="title" />
              <Box mt={4}>
                <InputField
                  textarea
                  label="Text"
                  name="text"
                  placeholder="text"
                />
              </Box>
              <Flex justifyContent="flex-end" mt={4}>
                <Button
                  onClick={() => {
                    router.push('/');
                  }}
                >
                  cancel
                </Button>
                <Button
                  ml={2}
                  isLoading={isSubmitting}
                  type="submit"
                  variantColor="teal"
                >
                  create post
                </Button>
              </Flex>
              {/* {!!submitError && (
                <Alert mt={5} status="error">
                  <AlertIcon />
                  <AlertTitle mr={2}>Failure</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )} */}
            </FormControl>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default AuthGuardSSR(CreatePost);
