import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  Stack,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import { usePostReplyMutation } from '../../generated/graphql';
import { AuthGuardSSR } from '../../urql/authGuardSSR';
import { getClientConfig } from '../../urql/urqlConfig';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { useIsAuthenticatedAndVerified } from '../../utils/useIsAuthenticatedAndVerified';
import { validatePostReplyInput } from '../../utils/validate';

function Reply() {
  useIsAuthenticatedAndVerified();

  const router = useRouter();
  const parentId = typeof router.query.id === 'string' ? router.query.id : '';
  const opId = typeof router.query.opid === 'string' ? router.query.opid : '';
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
    return (
      <Layout size="regular">
        <Stack spacing={0}>
          {data.thread.map((p) => (
            <Post
              key={p.id}
              post={p}
              opId={opId}
              shadow={!p.level ? 'md' : undefined}
              borderWidth="1px"
              ml={p.level * 4}
              borderLeft={p.level ? `2px solid teal` : undefined}
            />
          ))}
          <Formik
            initialValues={{
              text: '',
              parentId: parseInt(parentId),
              opId: parseInt(opId),
            }}
            validate={validatePostReplyInput}
            onSubmit={async (values) => {
              const response = await createPostReply({ input: values });
              if (response && response.data) {
                const { postReply } = response.data;

                if (postReply.error) {
                  setSubmitError(postReply.error);
                } else {
                  if (opId) {
                    router.push(`/post/${opId}`);
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

export default withUrqlClient(getClientConfig)(AuthGuardSSR(Reply));
