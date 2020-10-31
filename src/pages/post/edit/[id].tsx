import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Spinner,
  Stack,
} from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import Post from '../../../components/Post';
import Wrapper from '../../../components/Wrapper';
import {
  PostReplyFragment,
  useReplyQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { AuthGuardSSR } from '../../../urql/authGuardSSR';
import { useGetParamFromUrl } from '../../../utils/useGetParamFromUrl';
import { useIsAuthenticatedAndVerified } from '../../../utils/useIsAuthenticatedAndVerified';
import { validatePostInput } from '../../../utils/validate';

type EditPostProps = {};

function EditPost(props: EditPostProps) {
  useIsAuthenticatedAndVerified();

  const router = useRouter();
  const id = parseInt(useGetParamFromUrl('id') as string);
  const [{ data, fetching }] = useReplyQuery({
    variables: { id },
    requestPolicy: 'network-only',
  });
  const [submitError, setSubmitError] = useState('');

  const [, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return (
      <Layout>
        <Spinner
          display="block"
          mx="auto"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
          size="xl"
        />
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
      <Stack spacing={2}>
        {parentPost ? (
          <Post
            post={parentPost}
            preview={true}
            p={5}
            shadow="md"
            borderWidth="1px"
          />
        ) : (
          <Heading fontSize="xl">{data.post.title}</Heading>
        )}
        {(data.post.replies || data.post.voteCount) && (
          <Post
            post={data.post}
            preview={true}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderLeft={data.post.level ? `2px solid teal` : undefined}
          />
        )}
      </Stack>
      <Formik
        initialValues={{
          text:
            !data.post.replies && !data.post.voteCount ? data.post.text : '',
        }}
        validate={validatePostInput}
        onSubmit={async (values) => {
          const result = await updatePost({
            input: {
              id: id!,
              ...values,
            },
          });

          const errors = result.data?.updatePost.errors;
          if (errors) {
            setSubmitError(errors[0].message);
          } else {
            if (opId) {
              router.push(`/post/${opId}`);
            } else {
              router.push(`/post/${id}`);
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
                  label={parentPost ? 'Reply' : 'Text'}
                  name="text"
                  placeholder={placeholder(data.post!)}
                  resize="vertical"
                  rows={10}
                  height={undefined}
                  isDisabled={!!data.post?.flaggedAt}
                />
              </Box>
              <Flex mt={4} justifyContent="flex-end">
                <Button
                  onClick={() => {
                    if (opId) {
                      router.push(`/post/${opId}`);
                    } else {
                      router.push(`/post/${id}`);
                    }
                  }}
                >
                  cancel
                </Button>
                <Button
                  isLoading={isSubmitting}
                  isDisabled={!!data.post?.flaggedAt}
                  type="submit"
                  variantColor="teal"
                  ml={2}
                >
                  {!data?.post?.parent?.id ? 'update post' : 'update reply'}
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
    </Layout>
  );
}

function placeholder(post: PostReplyFragment) {
  return !!post.replies || !!post.voteCount
    ? 'this update will be appended to your original post'
    : !!post.parent?.id
    ? 'your reply'
    : 'text';
}

export default AuthGuardSSR(EditPost);
