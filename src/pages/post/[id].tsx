import { Spinner, Stack, useDisclosure, useToast } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import Post from '../../components/Post';
import {
  Post as PostType,
  useDeletePostMutation,
} from '../../generated/graphql';
import { formatMessage } from '../../utils/formatMessage';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

function Thread() {
  const [{ data, fetching }] = useGetPostFromUrl(10);
  const router = useRouter();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostType | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [, deletePost] = useDeletePostMutation();

  if (confirmDelete) {
    setConfirmDelete(false);

    if (!postToDelete) {
      return;
    }

    deletePost({
      id: postToDelete.id,
    }).then((result) => {
      if (result.data?.deletePost.success) {
        toast({
          position: 'top-right',
          title: 'Success',
          description: 'Post has been deleted!',
          status: 'success',
          duration: 6000,
          isClosable: true,
        });

        if (!postToDelete.originalPost) {
          router.push('/');
        }
      } else {
        toast({
          position: 'top-right',
          title: 'Failure',
          description: result.data?.deletePost.error
            ? formatMessage(result.data.deletePost.error)
            : '',
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      }
    });

    setPostToDelete(null);
  }

  const handleConfirmation = () => {
    setConfirmDelete(true);
    onClose();
  };

  const handleDelete = (post: PostType) => () => {
    if (!confirmDelete) {
      setPostToDelete(post);
      onOpen();
    }
  };

  if (fetching) {
    return (
      <Layout size="regular" aria-busy={true}>
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
  } else if (data && data.thread) {
    return (
      <>
        <Layout size="regular">
          <Stack spacing={0}>
            {data.thread.map((p) => (
              <Post
                key={p.id}
                post={p}
                p={2}
                shadow={!p.level ? 'md' : undefined}
                borderWidth="1px"
                ml={p.level * 4}
                borderLeft={p.level ? `2px solid teal` : undefined}
                handleDelete={handleDelete}
              />
            ))}
          </Stack>
        </Layout>
        <Modal
          title="Delete Post"
          message={`Delete: "${
            postToDelete && postToDelete.text.slice(0, 25) + '...'
          }". Are you sure?`}
          handleConfirmation={handleConfirmation}
          confirmButtonText="Yes, Delete"
          isOpen={isOpen}
          onClose={onClose}
        />
      </>
    );
  } else {
    return (
      <Layout size="regular">
        <div>Could not find post.</div>
      </Layout>
    );
  }
}

export default Thread;
