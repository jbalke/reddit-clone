import {
  Flex,
  FlexProps,
  IconButton,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import React, { useState } from 'react';
import { User, useToggleBanUserMutation } from '../generated/graphql';
import Modal from './Modal';

type AdminUserControlsProps = {
  user: User;
} & FlexProps;

function AdminUserControls({ user, ...props }: AdminUserControlsProps) {
  const [, toggleBan] = useToggleBanUserMutation();

  const [banConfirmed, setBanConfirmed] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const actionText = user.isBanned ? 'Unban' : 'Ban';

  const handleConfirmation = () => {
    setBanConfirmed(true);
    onClose();
  };

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
            onClick={() => onOpen()}
            variantColor={actionText === 'Ban' ? 'red' : 'green'}
          />
        </Tooltip>
      </Flex>
      <Modal
        title="Ban User"
        message={`${actionText}: ${user.username}. Are you sure?`}
        handleConfirmation={handleConfirmation}
        confirmButtonText={`Yes, ${actionText}`}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}

export default AdminUserControls;
