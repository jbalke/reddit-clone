import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  Stack,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import { usePostReplyMutation } from '../../generated/graphql';
import { AuthGuardSSR } from '../../urql/authGuardSSR';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { useIsAuthenticatedAndVerified } from '../../utils/useIsAuthenticatedAndVerified';
import { validatePostReplyInput } from '../../utils/validate';

function Reply() {
  useIsAuthenticatedAndVerified();

  const router = useRouter();
  const [, createPostReply] = usePostReplyMutation();
  const [{ data, fetching }] = useGetPostFromUrl();
  const [submitError, setSubmitError] = useState('');

  if (fetching) {
    return (
      <Layout size="regular">
        <div>Loading...</div>
      </Layout>
    );
  } else if (data && data.thread) {
    let { originalPost, id } = data.thread[0];

    return (
      <Layout size="regular">
        <Stack spacing={0}>
          {data.thread.map((p) => (
            <Post
              key={p.id}
              post={p}
              preview={true}
              shadow={!p.level ? 'md' : undefined}
            />
          ))}
          <Formik
            initialValues={{
              text: '',
              parentId: id,
              originalPostId: originalPost?.id ?? id,
            }}
            validate={validatePostReplyInput}
            onSubmit={async (values) => {
              const response = await createPostReply({ input: values });
              if (response && response.data) {
                const { postReply } = response.data;

                if (postReply.error) {
                  setSubmitError(postReply.error);
                } else {
                  if (originalPost?.id) {
                    router.push(`/post/${originalPost.id}`);
                  } else {
                    router.push('/');
                  }
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormControl>
                  <Box mt={4}>
                    <InputField
                      textarea
                      label="Reply"
                      name="text"
                      placeholder="reply"
                    />
                  </Box>
                  <Flex mt={4} justifyContent="flex-end">
                    <Button
                      onClick={() => {
                        if (originalPost?.id) {
                          router.push(`/post/${originalPost.id}`);
                        } else {
                          router.push('/');
                        }
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
                      reply
                    </Button>
                  </Flex>
                  {!!submitError && (
                    <Alert mt={5} status="error">
                      <AlertIcon />
                      <AlertTitle mr={2}>Failure</AlertTitle>
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}
                </FormControl>
              </Form>
            )}
          </Formik>
        </Stack>
      </Layout>
    );
  } else {
    return (
      <Layout size="regular">
        <div>Could not find post.</div>
      </Layout>
    );
  }
}

export default AuthGuardSSR(Reply);
