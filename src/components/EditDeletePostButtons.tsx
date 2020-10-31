import { Box, BoxProps, IconButton, Tooltip, useToast } from '@chakra-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  PostContentFragment,
  useDeletePostMutation,
  useMeQuery,
} from '../generated/graphql';
import { formatMessage } from '../utils/formatMessage';
import Modal from './Modal';
import { useModalState } from './useModalState';

type EditDeletePostButtonsProps = {
  post: PostContentFragment;
} & BoxProps;

function EditDeletePostButtons({ post, ...props }: EditDeletePostButtonsProps) {
  const router = useRouter();

  const [{ data }] = useMeQuery();
  const toast = useToast();
  const [
    deleteConfirmed,
    setDeleteConfirmed,
    onClick,
    handleConfirmation,
    isOpen,
    onClose,
  ] = useModalState();

  const [, deletePost] = useDeletePostMutation();

  if (deleteConfirmed) {
    setDeleteConfirmed(false);

    deletePost({
      id: post.id,
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

        if (!post.originalPost) {
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
  }

  return (
    <>
      <Box {...props}>
        <Link href={`/post/edit/${post.id}`}>
          <IconButton
            size="sm"
            mr={1}
            icon="edit"
            aria-label="Edit Post"
            title="Edit Post"
            isDisabled={!!post.flaggedAt || !!data?.me?.isBanned}
            variantColor="teal"
          />
        </Link>
        <Tooltip
          label="delete post"
          aria-label="delete post"
          placement="bottom"
        >
          <IconButton
            size="sm"
            aria-label="Delete Post"
            // title="Delete Post"
            icon="delete"
            onClick={onClick}
            isDisabled={!!post.flaggedAt || !!data?.me?.isBanned}
            variantColor="teal"
          />
        </Tooltip>
      </Box>
      <Modal
        title="Delete Post"
        message={`Delete: "${post.text.slice(0, 25) + '...'}". Are you sure?`}
        handleConfirmation={handleConfirmation}
        confirmButtonText="Yes, Delete"
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}

export default EditDeletePostButtons;
