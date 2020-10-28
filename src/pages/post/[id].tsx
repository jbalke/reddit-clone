import { Spinner, Stack, useDisclosure, useToast } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import Post from '../../components/Post';
import {
  PostContentFragment as PostType,
  useDeletePostMutation,
  useFlagPostMutation,
} from '../../generated/graphql';
import { formatMessage } from '../../utils/formatMessage';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

function Thread() {
  const [{ data, fetching }] = useGetPostFromUrl(10);
  const router = useRouter();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmFlag, setConfirmFlag] = useState(false);
  const [postToAction, setPostToAction] = useState<PostType | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: flagIsOpen,
    onOpen: flagOnOpen,
    onClose: flagOnClose,
  } = useDisclosure();

  const toast = useToast();

  const [, deletePost] = useDeletePostMutation();
  const [, flagPost] = useFlagPostMutation();

  const handleFlagConfirmation = () => {
    setConfirmFlag(true);
    flagOnClose();
  };

  const handleFlag = (post: PostType) => () => {
    if (!confirmFlag) {
      setPostToAction(post);
      flagOnOpen();
    }
  };

  if (confirmFlag) {
    actionConfirmedPost(setConfirmFlag, postToAction, setPostToAction, () => {
      flagPost({
        id: postToAction!.id,
      }).then((result) => {
        if (result.data?.flagPost) {
          toast({
            position: 'top-right',
            title: 'Success',
            description: 'Post has been flagged!',
            status: 'success',
            duration: 6000,
            isClosable: true,
          });

          // if (!postToAction!.originalPost) {
          //   router.push('/');
          // }
        }
      });
    });
  } else if (confirmDelete) {
    setConfirmDelete(false);

    if (!postToAction) {
      return;
    }

    deletePost({
      id: postToAction.id,
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

        if (!postToAction.originalPost) {
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

    setPostToAction(null);
  }

  const handleConfirmation = () => {
    setConfirmDelete(true);
    onClose();
  };

  const handleDelete = (post: PostType) => () => {
    if (!confirmDelete) {
      setPostToAction(post);
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
                handleFlag={handleFlag}
              />
            ))}
          </Stack>
        </Layout>
        <Modal
          title="Delete Post"
          message={`Delete: "${
            postToAction && postToAction.text.slice(0, 25) + '...'
          }". Are you sure?`}
          handleConfirmation={handleConfirmation}
          confirmButtonText="Yes, Delete"
          isOpen={isOpen}
          onClose={onClose}
        />
        <Modal
          title="Flag Post"
          message={`Flag: "${
            postToAction && postToAction.text.slice(0, 25) + '...'
          }". Are you sure?`}
          handleConfirmation={handleFlagConfirmation}
          confirmButtonText="Yes, Flag"
          isOpen={flagIsOpen}
          onClose={flagOnClose}
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

function actionConfirmedPost(
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>,
  postToAction: PostType | null,
  setPostToAction: React.Dispatch<React.SetStateAction<PostType | null>>,
  postMutation: () => void
) {
  setConfirm(false);

  if (!postToAction) {
    return;
  }

  postMutation();

  setPostToAction(null);
}
