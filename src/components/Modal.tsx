import {
  Button,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SlideIn,
} from '@chakra-ui/core';

type fn = () => void;

type ModalProps = {
  title: string;
  message: string;
  handleConfirmation: () => void;
  confirmButtonText: string;
  isOpen: boolean;
  onClose: fn;
};

function Modal({
  title,
  message,
  handleConfirmation,
  confirmButtonText,
  isOpen,
  onClose,
}: ModalProps) {
  return (
    <SlideIn in={isOpen}>
      {(styles: any): any => (
        <ChakraModal
          preserveScrollBarGap
          closeOnOverlayClick={false}
          isOpen={true}
          onClose={onClose}
        >
          <ModalOverlay opacity={styles.opacity} />
          <ModalContent pb={5} {...styles}>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{message}</ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button variantColor="red" onClick={handleConfirmation}>
                {confirmButtonText}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ChakraModal>
      )}
    </SlideIn>
  );
}

export default Modal;
