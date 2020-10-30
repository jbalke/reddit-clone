import { useDisclosure } from '@chakra-ui/core';
import { Dispatch, SetStateAction, useState } from 'react';

type ModalState = [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  () => void,
  () => void,
  boolean,
  () => void
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
    confirmed,
    setConfirmed,
    onClick,
    handleConfirmation,
    isOpen,
    onClose,
  ];
}
