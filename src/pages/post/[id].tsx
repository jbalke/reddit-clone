import { Button, Flex, Stack, useToast } from '@chakra-ui/core';
import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import Modal from '../../components/Modal';
import { useRouter } from 'next/router';
import { MyContext } from '../../myContext';
import {
  Post as PostType,
  useDeletePostMutation,
} from '../../generated/graphql';
import { formatMessage } from '../../utils/formatMessage';

function Thread() {
  const [{ data, fetching }] = useGetPostFromUrl(10);

  const { setIsModalOpen, isModalOpen } = useContext(MyContext);
  const router = useRouter();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostType | null>(null);
  const toast = useToast();

  const [, deletePost] = useDeletePostMutation();

  if (confirmDelete) {
    setConfirmDelete(false);

    if (!postToDelete) return;

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

  const onOpen = () => {
    setIsModalOpen!(true);
  };

  const onClose = () => {
    setIsModalOpen!(false);
  };

  if (fetching) {
    return (
      <Layout size="regular">
        <div>Loading...</div>
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
                shadow={!p.level ? 'md' : undefined}
                borderWidth="1px"
                ml={p.level * 4}
                borderLeft={p.level ? `2px solid teal` : undefined}
                handleDelete={handleDelete}
              />
            ))}
          </Stack>
        </Layout>

        <Modal title="Delete Post" isOpen={isModalOpen} onClose={onClose}>
          {`Delete "${
            postToDelete && postToDelete.text.slice(0, 25) + '...'
          }". Are you sure?`}
          <Flex mt={4} justifyContent="flex-end">
            <Button onClick={onClose}>Cancel</Button>
            <Button ml={2} variantColor="teal" onClick={handleConfirmation}>
              OK
            </Button>
          </Flex>
        </Modal>
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
