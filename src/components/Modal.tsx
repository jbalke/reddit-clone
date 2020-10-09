import { Box, Flex, Heading, IconButton } from '@chakra-ui/core';
import ReactDom from 'react-dom';

type ModalProps = {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => any;
};

const Modal = ({ children, isOpen, onClose, title }: ModalProps) => {
  if (isOpen) {
    fixBody();
  } else {
    restoreBody();
    return null;
  }

  let container: HTMLElement | null = null;

  container = document.getElementById('portal');
  if (!container) return null;

  return ReactDom.createPortal(
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="rgba(0,0,0,0.7)"
        zIndex={1000}
      ></Box>
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        backgroundColor="white"
        zIndex={1000}
        p={5}
        border="1px solid"
        maxWidth="33vw"
      >
        <Flex justifyContent="space-between" align="center" mb={4}>
          <Heading as="h2" fontSize="lg">
            {title}
          </Heading>
          <IconButton
            size="xs"
            icon="close"
            aria-label="close"
            onClick={onClose}
            border="1px solid"
            variantColor="red"
          />
        </Flex>
        {children}
      </Box>
    </>,
    container
  );
};

const fixBody = () => {
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.position = 'fixed';
  document.body.style.width = '100vw';
  document.body.style.paddingRight = '15px';
};

const restoreBody = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.paddingRight = '';
  document.body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
};

export default Modal;
