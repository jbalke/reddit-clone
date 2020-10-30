import {
  Flex,
  FlexProps,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/core';
import React from 'react';
import { User, useToggleBanUserMutation } from '../generated/graphql';
import Modal from './Modal';
import { useModalState } from './useModalState';

type AdminUserControlsProps = {
  user: User;
} & FlexProps;

function AdminUserControls({ user, ...props }: AdminUserControlsProps) {
  const [, toggleBan] = useToggleBanUserMutation();
  const [
    banConfirmed,
    setBanConfirmed,
    onClick,
    handleConfirmation,
    isOpen,
    onClose,
  ] = useModalState();
  const toast = useToast();

  const actionText = user.isBanned ? 'Unban' : 'Ban';

  if (banConfirmed) {
    setBanConfirmed(false);

    toggleBan({ userId: user.id }).then((result) => {
      if (result.data?.toggleBanUser) {
        toast({
          position: 'top-right',
          title: 'Success',
          description: `User has been ${
            result.data.toggleBanUser.isBanned ? 'banned' : 'unbanned'
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

  return (
    <>
      <Flex justifyContent="flex-end" {...props}>
        <Tooltip
          label={`${actionText} User`}
          aria-label={`${actionText} User`}
          placement="bottom"
        >
          <IconButton
            size="sm"
            icon="warning"
            aria-label="Ban User"
            onClick={onClick}
            variantColor={actionText === 'Ban' ? 'red' : 'green'}
          />
        </Tooltip>
      </Flex>
      <Modal
        title="Ban User"
        message={`${actionText} ${user.username}. Are you sure?`}
        handleConfirmation={handleConfirmation}
        confirmButtonText={`Yes, ${actionText}`}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}

export default AdminUserControls;
