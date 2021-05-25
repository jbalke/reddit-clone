import React from 'react';
import Header from './Header';
import Wrapper, { WrapperProps } from './Wrapper';

type LayoutProps = {
  children: React.ReactNode;
} & WrapperProps;

function Layout({ children, ...props }: LayoutProps) {
  return (
    <>
      <Header />
      <Wrapper {...props}>{children}</Wrapper>
    </>
  );
}

export default Layout;
