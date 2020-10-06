import { Box, Button, Flex, FormControl } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import PostPreview from '../../../components/PostPreview';
import Wrapper from '../../../components/Wrapper';
import {
  useReplyQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { AuthGuardSSR } from '../../../urql/authGuardSSR';
import { getClientConfig } from '../../../urql/urqlConfig';
import { useGetParamFromUrl } from '../../../utils/useGetParamFromUrl';
import { useIsAuthenticatedAndVerified } from '../../../utils/useIsAuthenticatedAndVerified';
import { validatePostInput } from '../../../utils/validate';

type EditPostProps = {};

function EditPost(props: EditPostProps) {
  useIsAuthenticatedAndVerified();

  const router = useRouter();
  const id = parseInt(useGetParamFromUrl('id') as string);
  const [{ data, fetching }] = useReplyQuery({ variables: { id } });

  const [, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return (
      <Layout>
        <Wrapper size="small">loading...</Wrapper>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Wrapper size="small">post not found</Wrapper>
      </Layout>
    );
  }

  const opId = data.post.originalPost?.id;
  const parentPost = data.post.parent;

  return (
    <Layout size="regular">
      {parentPost && (
        <PostPreview
          key={data.post.id}
          post={parentPost}
          p={5}
          shadow="md"
          borderWidth="1px"
        />
      )}
      <Formik
        initialValues={{
          title: data.post.title || '',
          text: data.post.text,
        }}
        validate={validatePostInput}
        onSubmit={async (values) => {
          await updatePost({
            id: id!,
            ...values,
          });

          if (opId) {
            router.push(`/post/${opId}`);
          } else {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              {!data?.post?.parent?.id && (
                <InputField label="Title" name="title" placeholder="title" />
              )}
              <Box mt={4}>
                <InputField
                  textarea
                  label={parentPost ? 'Reply' : 'Text'}
                  name="text"
                  placeholder="reply"
                  resize="vertical"
                />
              </Box>
              <Flex mt={4} justifyContent="flex-end">
                <Button
                  onClick={() => {
                    if (opId) {
                      router.push(`/post/${opId}`);
                    } else {
                      router.push('/');
                    }
                  }}
                >
                  cancel
                </Button>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  variantColor="teal"
                  ml={2}
                >
                  {!data?.post?.parent?.id ? 'update post' : 'update reply'}
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

export default withUrqlClient(getClientConfig)(AuthGuardSSR(EditPost));
