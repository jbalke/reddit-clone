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
import { useModalState } from '../utils/useModalState';

type AdminControlsProps = {
  post: PostContentFragment;
} & FlexProps;

function AdminControls({ post, ...props }: AdminControlsProps) {
  const [lockIntent, lockAction, lockModal] = useModalState();
  const [pinIntent, pinAction, pinModal] = useModalState();
  const [flagIntent, flagAction, flagModal] = useModalState();

  const [, toggleLockThread] = useToggleLockThreadMutation();
  const [, togglePinThread] = useTogglePinThreadMutation();
  const [, flagPost] = useFlagPostMutation();
  const toast = useToast();

  if (lockIntent.confirmed) {
    lockIntent.setConfirmed(false);

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
  } else if (pinIntent.confirmed) {
    pinIntent.setConfirmed(false);

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
  } else if (flagIntent.confirmed) {
    flagIntent.setConfirmed(false);

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

  const lockIntentText = post.isLocked ? 'Unlock' : 'Lock';
  const pinIntentText = post.isPinned ? 'Unpin' : 'Pin';

  return (
    <>
      <Flex justify="center" {...props}>
        <Tooltip label="Flag Post" aria-label="Flag Post" placement="bottom">
          <IconButton
            size="sm"
            icon="warning"
            aria-label="Flag Post"
            isDisabled={!!post.flaggedAt}
            onClick={flagAction.onClick}
            variantColor="orange"
          />
        </Tooltip>
        {post.level === 0 && (
          <Tooltip
            label={`${pinIntentText} Thread`}
            aria-label={`${pinIntentText} Thread`}
            placement="bottom"
          >
            <IconButton
              ml={1}
              size="sm"
              icon="star"
              aria-label="Pin Thread"
              onClick={pinAction.onClick}
              variantColor={post.isPinned ? 'red' : 'green'}
            />
          </Tooltip>
        )}
        {post.level === 0 && (
          <Tooltip
            label={`${lockIntentText} Thread`}
            aria-label={`${lockIntentText} Thread`}
            placement="bottom"
          >
            <IconButton
              ml={1}
              size="sm"
              icon={post.isLocked ? 'unlock' : 'lock'}
              aria-label="Lock Thread"
              onClick={lockAction.onClick}
              variantColor={post.isLocked ? 'red' : 'green'}
            />
          </Tooltip>
        )}
      </Flex>
      <Modal
        title={`${lockIntentText} Thread`}
        message={`Are you sure?`}
        handleConfirmation={lockAction.handleConfirmation}
        confirmButtonText={`Yes, ${lockIntentText}`}
        isOpen={lockModal.isOpen}
        onClose={lockModal.onClose}
      />
      <Modal
        title={`${pinIntentText} Thread`}
        message={`Are you sure?`}
        handleConfirmation={pinAction.handleConfirmation}
        confirmButtonText={`Yes, ${pinIntentText}`}
        isOpen={pinModal.isOpen}
        onClose={pinModal.onClose}
      />
      <Modal
        title="Flag Post"
        message={`Flag: "${post.text.slice(0, 25) + '...'}". Are you sure?`}
        handleConfirmation={flagAction.handleConfirmation}
        confirmButtonText="Yes, Flag"
        isOpen={flagModal.isOpen}
        onClose={flagModal.onClose}
      />
    </>
  );
}

export default AdminControls;
