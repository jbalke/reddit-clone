import { Box, Button, Flex, FormControl } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import Wrapper from '../../../components/Wrapper';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { getClientConfig } from '../../../urql/urqlConfig';
import { useGetParamFromUrl } from '../../../utils/useGetParamFromUrl';
import { validatePostInput } from '../../../utils/validate';

type EditPostProps = {};

function EditPost(props: EditPostProps) {
  const router = useRouter();

  const id = useGetParamFromUrl('id') as string;
  const [{ data, fetching }] = usePostQuery({ variables: { id } });
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

  return (
    <Layout size="small">
      <Formik
        initialValues={{
          title: data.post.title,
          text: data.post.text,
        }}
        validate={validatePostInput}
        onSubmit={async (values) => {
          await updatePost({
            id: id!,
            ...values,
          });
          router.back();
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
                  resize="vertical"
                />
              </Box>
              <Flex mt={4}>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  variantColor="teal"
                  mr={2}
                >
                  update post
                </Button>
                <Button
                  onClick={() => {
                    router.back();
                  }}
                >
                  cancel
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

export default withUrqlClient(getClientConfig)(EditPost);
