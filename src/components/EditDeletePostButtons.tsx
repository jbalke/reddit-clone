import {
  Box,
  BoxProps,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/core';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  PostContentFragment,
  PostSummaryFragment,
  useDeletePostMutation,
} from '../generated/graphql';
import { useRouter } from 'next/router';
import { isSummary } from '../utils/isSummary';
import { useToast } from '@chakra-ui/core';
import { formatMessage } from '../utils/formatMessage';

type EditDeletePostButtonsProps = {
  post: PostSummaryFragment | PostContentFragment;
} & BoxProps;

type ConfirmationProps = {
  message: string;
};

function EditDeletePostButtons({ post, ...props }: EditDeletePostButtonsProps) {
  const [, deletePost] = useDeletePostMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const router = useRouter();

  if (confirmDelete) {
    setConfirmDelete(false);

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

  const Confirmation = ({ message }: ConfirmationProps) => {
    const handleConfirmation = () => {
      setConfirmDelete(true);
      onClose();
    };
    return (
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        preserveScrollBarGap
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{`Delete "${message}". Are you sure?`}</ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variantColor="red" mr={3} onClick={handleConfirmation}>
              YES, DELETE
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      onOpen();
    }
  };

  return (
    <>
      <Box {...props}>
        <Link href={`/post/edit/${post.id}`}>
          <IconButton
            mr={2}
            icon="edit"
            aria-label="Edit Post"
            title="Edit Post"
          />
        </Link>
        <IconButton
          icon="delete"
          aria-label="Delete Post"
          title="Delete Post"
          onClick={handleDelete}
        />
      </Box>
      <Confirmation message={isSummary(post) ? post.textSnippet : post.text} />
    </>
  );
}

export default EditDeletePostButtons;
