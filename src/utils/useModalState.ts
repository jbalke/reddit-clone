import { useDisclosure } from '@chakra-ui/core';
import { Dispatch, SetStateAction, useState } from 'react';

type ModalState = [
  {
    confirmed: boolean;
    setConfirmed: Dispatch<SetStateAction<boolean>>;
  },
  {
    onClick: () => void;
    handleConfirmation: () => void;
  },
  {
    isOpen: boolean;
    onClose: () => void;
  }
];

export function useModalState(): ModalState {
  const [confirmed, setConfirmed] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirmation = () => {
    setConfirmed(true);
    onClose();
  };

  const onClick = () => {
    if (!confirmed) {
      onOpen();
    }
  };

  return [
    {
      confirmed,
      setConfirmed,
    },
    {
      onClick,
      handleConfirmation,
    },
    {
      isOpen,
      onClose,
    },
  ];
}
