import React from 'react';
import Header from './Header';
import Wrapper, { WrapperProps } from './Wrapper';

function Layout({ children, ...props }: WrapperProps) {
  return (
    <>
      <Header />
      <Wrapper {...props}>{children}</Wrapper>
    </>
  );
}

export default Layout;
