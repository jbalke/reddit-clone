import {
  Flex,
  FlexProps,
  IconButton,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import React, { useState } from 'react';
import {
  PostContentFragment,
  useToggleLockThreadMutation,
} from '../generated/graphql';
import { postAction } from '../types';
import Modal from './Modal';

type AdminControlsProps = {
  post: PostContentFragment;
  handleFlag: postAction;
} & FlexProps;

function AdminControls({ post, handleFlag, ...props }: AdminControlsProps) {
  const [lockConfirmed, setLockConfirmed] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [, toggleLockThread] = useToggleLockThreadMutation();
  const toast = useToast();

  const handleConfirmation = () => {
    setLockConfirmed(true);
    onClose();
  };

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
  }

  const actionText = post.isLocked ? 'Unlock' : 'Lock';

  return (
    <>
      <Flex justify="center" {...props}>
        <Tooltip label="Flag Post" aria-label="Flag Post" placement="bottom">
          <IconButton
            size="sm"
            icon="warning"
            aria-label="Flag Post"
            isDisabled={!!post.flaggedAt}
            onClick={handleFlag(post)}
            variantColor="orange"
          />
        </Tooltip>
        {post.level === 0 && (
          <Tooltip
            label={`${actionText} Thread`}
            aria-label={`${actionText} Thread`}
            placement="bottom"
          >
            <IconButton
              ml={1}
              size="sm"
              icon="lock"
              aria-label="Lock Thread"
              onClick={() => onOpen()}
              variantColor={actionText === 'Lock' ? 'red' : 'green'}
            />
          </Tooltip>
        )}
      </Flex>
      <Modal
        title={`${actionText} Thread`}
        message={`Are you sure?`}
        handleConfirmation={handleConfirmation}
        confirmButtonText={`Yes, ${actionText}`}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}

export default AdminControls;
