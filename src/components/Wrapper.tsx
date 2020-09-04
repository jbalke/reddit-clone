import { Box } from '@chakra-ui/core';
import React from 'react';

interface WrapperProps {
  children: React.ReactNode;
  size?: 'small' | 'regular';
}

function Wrapper({ size = 'regular', children }: WrapperProps) {
  return (
    <Box
      maxW={size === 'regular' ? '800px' : '400px'}
      w="100%"
      mt={8}
      mx="auto"
    >
      {children}
    </Box>
  );
}

export default Wrapper;
