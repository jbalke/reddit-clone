import {
  Flex,
  FlexProps,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/core';
import React from 'react';
import {
  PostContentFragment,
  useFlagPostMutation,
  useToggleLockThreadMutation,
  useTogglePinThreadMutation,
} from '../generated/graphql';
import Modal from './Modal';
import { useModalState } from './useModalState';

type AdminControlsProps = {
  post: PostContentFragment;
} & FlexProps;

function AdminControls({ post, ...props }: AdminControlsProps) {
  const [
    lockConfirmed,
    setLockConfirmed,
    lockOnClick,
    handleLockConfirmation,
    lockIsOpen,
    lockOnClose,
  ] = useModalState();
  const [
    pinConfirmed,
    setPinConfirmed,
    pinOnClick,
    handlePinConfirmation,
    pinIsOpen,
    pinOnClose,
  ] = useModalState();
  const [
    flagConfirmed,
    setFlagConfirmed,
    flagOnClick,
    handleFlagConfirmation,
    flagIsOpen,
    flagOnClose,
  ] = useModalState();

  const [, toggleLockThread] = useToggleLockThreadMutation();
  const [, togglePinThread] = useTogglePinThreadMutation();
  const [, flagPost] = useFlagPostMutation();
  const toast = useToast();

  if (lockConfirmed) {
    setLockConfirmed(false);

    toggleLockThread({ id: post.id }).then((result) => {
      if (result.data && result.data.toggleLockThread?.length) {
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Thread has been ${
            result.data.toggleLockThread.some((p) => p.isLocked)
              ? 'locked'
              : 'unlocked'
          }`,
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
      } else {
        toast({
          position: 'top-right',
          title: 'Failure',
          description: `Operation failed`,
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      }
    });
  } else if (pinConfirmed) {
    setPinConfirmed(false);

    togglePinThread({ id: post.id }).then((result) => {
      if (result.data && result.data.togglePinThread) {
        toast({
          position: 'top-right',
          title: 'Success',
          description: `Thread has been ${
            result.data.togglePinThread.isPinned ? 'pinned' : 'unpinned'
          }`,
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
      } else {
        toast({
          position: 'top-right',
          title: 'Failure',
          description: `Operation failed`,
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      }
    });
  } else if (flagConfirmed) {
    setFlagConfirmed(false);

    flagPost({
      id: post.id,
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
      }
    });
  }

  const lockActionText = post.isLocked ? 'Unlock' : 'Lock';
  const pinActionText = post.isPinned ? 'Unpin' : 'Pin';

  return (
    <>
      <Flex justify="center" {...props}>
        <Tooltip label="Flag Post" aria-label="Flag Post" placement="bottom">
          <IconButton
            size="sm"
            icon="warning"
            aria-label="Flag Post"
            isDisabled={!!post.flaggedAt}
            onClick={flagOnClick}
            variantColor="orange"
          />
        </Tooltip>
        {post.level === 0 && (
          <Tooltip
            label={`${pinActionText} Thread`}
            aria-label={`${pinActionText} Thread`}
            placement="bottom"
          >
            <IconButton
              ml={1}
              size="sm"
              icon="star"
              aria-label="Pin Thread"
              onClick={pinOnClick}
              variantColor={post.isPinned ? 'red' : 'green'}
            />
          </Tooltip>
        )}
        {post.level === 0 && (
          <Tooltip
            label={`${lockActionText} Thread`}
            aria-label={`${lockActionText} Thread`}
            placement="bottom"
          >
            <IconButton
              ml={1}
              size="sm"
              icon={post.isLocked ? 'unlock' : 'lock'}
              aria-label="Lock Thread"
              onClick={lockOnClick}
              variantColor={post.isLocked ? 'red' : 'green'}
            />
          </Tooltip>
        )}
      </Flex>
      <Modal
        title={`${lockActionText} Thread`}
        message={`Are you sure?`}
        handleConfirmation={handleLockConfirmation}
        confirmButtonText={`Yes, ${lockActionText}`}
        isOpen={lockIsOpen}
        onClose={lockOnClose}
      />
      <Modal
        title={`${pinActionText} Thread`}
        message={`Are you sure?`}
        handleConfirmation={handlePinConfirmation}
        confirmButtonText={`Yes, ${pinActionText}`}
        isOpen={pinIsOpen}
        onClose={pinOnClose}
      />
      <Modal
        title="Flag Post"
        message={`Flag: "${post.text.slice(0, 25) + '...'}". Are you sure?`}
        handleConfirmation={handleFlagConfirmation}
        confirmButtonText="Yes, Flag"
        isOpen={flagIsOpen}
        onClose={flagOnClose}
      />
    </>
  );
}

export default AdminControls;
