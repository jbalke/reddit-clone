import { Box, Button, FormControl } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import { getClientConfig } from '../urql/urqlConfig';
import { useIsAuth } from '../utils/useIsAuth';
import { validatePostInput } from '../utils/validate';

function CreatePost() {
  const [, createPost] = useCreatePostMutation();
  useIsAuth();
  const router = useRouter();

  return (
    <Layout>
      <Wrapper size="small">
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
                <Button
                  mt={4}
                  isLoading={isSubmitting}
                  type="submit"
                  variantColor="teal"
                >
                  create post
                </Button>
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
      </Wrapper>
    </Layout>
  );
}

export default withUrqlClient(getClientConfig, { ssr: true })(CreatePost);
