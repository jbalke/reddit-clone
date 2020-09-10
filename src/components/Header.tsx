import { Box, Button, Flex, Heading } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { clearAccessToken } from '../accessToken';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { NextChakraLink } from './NextChakraLink';

type HeaderProps = {};

type MenuItemProps = {
  children: ReactNode;
};
const MenuItems = ({ children }: MenuItemProps) => (
  <Box mt={{ base: 4, sm: 0, md: 0 }} mr={6} display="block">
    {children}
  </Box>
);

const Header = (props: HeaderProps) => {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);
  const router = useRouter();

  const [{ data, fetching, error }] = useMeQuery({ pause: isServer() }); //* Pause query is server-side rendered (nextjs server doesn't have tokens to query graphql)
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  const handleLogout = ({ router }: any) => async () => {
    const result = await logout();

    if (result.data?.logout) {
      clearAccessToken();
      router.push('/logout');
    }
  };

  let authLinks = null;
  if (fetching) {
  } else if (data && !data.me) {
    authLinks = (
      <>
        <MenuItems>
          <NextChakraLink href="/register">Register</NextChakraLink>
        </MenuItems>
        <MenuItems>
          <NextChakraLink href="/login">Login</NextChakraLink>
        </MenuItems>
      </>
    );
  } else if (data && data.me) {
    authLinks = (
      <Box display={{ sm: 'block', md: 'flex' }} justifyContent="space-between">
        <Box
          pr={2}
          borderRight={{ sm: 'none', md: '2px white solid' }}
          borderBottom={{ sm: '2px white solid', md: 'none' }}
          paddingBottom={{ sm: '4px', md: '0' }}
        >
          Logged in as {data.me.username}
        </Box>
        <Box pl={{ sm: '0', md: '4px' }}>
          <Button
            variant="link"
            color="white"
            verticalAlign="baseline"
            onClick={handleLogout({ router })}
            isLoading={logoutFetching}
          >
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

          {!!data?.me && (
            <MenuItems>
              <NextChakraLink href="/token_test">Token Test</NextChakraLink>
            </MenuItems>
          )}
        </Box>

        <Box display={{ sm: 'block', md: 'flex' }}>{authLinks}</Box>
      </Box>
    </Flex>
  );
};

export default Header;
