import React, { ReactNode, useState } from 'react';
import { Box, Heading, Flex, Text, Button } from '@chakra-ui/core';
import { NextChakraLink } from './NextChakraLink';
import { useMeQuery } from '../generated/graphql';
import { clearAccessToken } from '../accessToken';
import { useRouter } from 'next/router';

type MenuItemProps = {
  children: ReactNode;
};

type HeaderProps = {};

const MenuItems = ({ children }: MenuItemProps) => (
  <Text mt={{ base: 4, sm: 0, md: 0 }} mr={6} display="block">
    {children}
  </Text>
);

const Header = (props: HeaderProps) => {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);
  const router = useRouter();

  const [result, reexecuteQuery] = useMeQuery({
    requestPolicy: 'network-only',
  });

  const handleLogout = ({ router }: any) => async () => {
    const response = await fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include',
    });

    reexecuteQuery({ requestPolicy: 'network-only' });

    const data = await response.json();
    if (data.ok) {
      clearAccessToken();
      router.push('/logout');
    }
  };

  let authBody = null;
  if (result.fetching) {
  } else if (!result.data?.me) {
    authBody = (
      <>
        <MenuItems>
          <NextChakraLink href="/register">Register</NextChakraLink>
        </MenuItems>
        <MenuItems>
          <NextChakraLink href="/login">Login</NextChakraLink>
        </MenuItems>
      </>
    );
  } else {
    authBody = (
      <Box display={{ sm: 'block', md: 'flex' }} justifyContent="space-between">
        <Box
          pr={2}
          borderRight={{ sm: 'none', md: '2px white solid' }}
          borderBottom={{ sm: '2px white solid', md: 'none' }}
          paddingBottom={{ sm: '4px', md: '0' }}
        >
          Logged in as {result.data.me.username}
        </Box>
        <Box pl={{ sm: '0', md: '4px' }}>
          <Button variant="link" onClick={handleLogout({ router })}>
            Logout
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="teal.500"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg">
          Chakra UI
        </Heading>
      </Flex>

      <Box display={{ sm: 'block', md: 'none' }} onClick={handleToggle}>
        <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={{ sm: show ? 'block' : 'none', md: 'flex' }}
        width={{ sm: 'full', md: 'auto' }}
        justifyContent="space-between"
        alignItems="center"
        flexGrow={1}
      >
        <Box display={{ sm: 'block', md: 'flex' }}>
          <MenuItems>
            <NextChakraLink href="/">Home</NextChakraLink>
          </MenuItems>
          <MenuItems>
            <NextChakraLink href="/token_test">Token Test</NextChakraLink>
          </MenuItems>
        </Box>

        <Box display={{ sm: 'block', md: 'flex' }}>{authBody}</Box>
      </Box>
    </Flex>
  );
};

export default Header;
