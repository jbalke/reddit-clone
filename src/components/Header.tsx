import { Box, BoxProps, Button, Flex, Heading } from '@chakra-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { clearAccessToken } from '../accessToken';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { NextChakraLink } from './NextChakraLink';

type MenuItemProps = {
  children: ReactNode;
} & BoxProps;

const MenuItem = ({ children, ...props }: MenuItemProps) => (
  <Box mt={{ base: 4, sm: 0, md: 0 }} mr={6} display="block" {...props}>
    {children}
  </Box>
);

type HeaderProps = {};

const Header = (props: HeaderProps) => {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);
  const router = useRouter();

  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  const handleLogout = () => async () => {
    const result = await logout();

    if (result.data?.logout) {
      clearAccessToken();
      router.push('/');
    }
  };

  let authLinks = null;
  if (fetching) {
  } else if (data && !data.me) {
    authLinks = (
      <>
        <MenuItem>
          <NextChakraLink href="/register">Register</NextChakraLink>
        </MenuItem>
        <MenuItem>
          <NextChakraLink href="/login">Login</NextChakraLink>
        </MenuItem>
      </>
    );
  } else if (data && data.me) {
    authLinks = (
      <>
        <Link href="/create-post">
          <Button
            mx={{ sm: 0, md: 2 }}
            my={{ sm: 2, md: 0 }}
            variantColor="whiteAlpha"
            aria-label="create post"
          >
            create post
          </Button>
        </Link>
        <Box
          px={{ sm: 0, md: 2 }}
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
            onClick={handleLogout()}
            isLoading={logoutFetching}
          >
            Logout
          </Button>
        </Box>
      </>
    );
  }

  return (
    <Flex
      as="nav"
      padding="1.5rem"
      bg="teal.500"
      color="white"
      justifyContent="center"
    >
      <Flex
        maxW={{ sm: '100%', md: '800px' }}
        alignItems="center"
        justifyContent="space-between"
        flexGrow={1}
      >
        <Flex align="center" mr={5}>
          <NextChakraLink href="/">
            <Heading as="h1" size="lg">
              Reddit Clone
            </Heading>
          </NextChakraLink>
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
            <MenuItem>
              <NextChakraLink href="/">Home</NextChakraLink>
            </MenuItem>

            {!!data?.me && (
              <MenuItem>
                <NextChakraLink href="/token-test">Token Test</NextChakraLink>
              </MenuItem>
            )}
          </Box>

          <Box
            display={{ sm: 'block', md: 'flex' }}
            justifyContent="space-between"
            alignItems="center"
          >
            {authLinks}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Header;
