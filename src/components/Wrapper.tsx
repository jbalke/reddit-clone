import { Box, BoxProps } from '@chakra-ui/core';
import React from 'react';

export type WrapperProps = {
  children: React.ReactNode;
  size?: 'small' | 'regular';
} & BoxProps;

function Wrapper({ size = 'regular', children, ...boxProps }: WrapperProps) {
  return (
    <Box
      maxW={size === 'regular' ? '800px' : '400px'}
      w="100%"
      mt={8}
      mx="auto"
      {...boxProps}
    >
      {children}
    </Box>
  );
}

export default Wrapper;
