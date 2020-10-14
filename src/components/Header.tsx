import { Box, BoxProps, Button, Flex, Heading, Text } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { ReactNode, useContext, useState } from 'react';
import { clearAccessToken } from '../accessToken';
import { __isProd__ } from '../constants';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { MyContext } from '../myContext';
import { NextChakraLink } from './NextChakraLink';

type MenuItemProps = {
  children: ReactNode;
} & BoxProps;

const MenuItem = ({ children, ...props }: MenuItemProps) => (
  <Box mt={{ base: 4, sm: 0, md: 0 }} mr={6} display="block" {...props}>
    {children}
  </Box>
);

const Header = () => {
  const { resetUrqlClient } = useContext(MyContext);
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();

    if (result.data?.logout) {
      clearAccessToken();
      if (resetUrqlClient) {
        resetUrqlClient();
      }
      router.push('/');
    }
  };
  const logoutButton = (
    <Button
      variant="link"
      color="white"
      verticalAlign="baseline"
      onClick={handleLogout}
      isLoading={logoutFetching}
    >
      Logout
    </Button>
  );

  const [{ data, fetching }] = useMeQuery();

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
        <Box
          px={{ sm: 0, md: 2 }}
          mt={{ sm: 2, md: 0 }}
          borderRight={{ sm: 'none', md: '2px white solid' }}
          borderBottom={{ sm: '2px white solid', md: 'none' }}
          paddingBottom={{ sm: '4px', md: '0' }}
        >
          Logged in as {data.me.username}{' '}
          {data.me.isBanned && (
            <Text cursor="not-allowed" title="Banned" display="inline">
              (B)
            </Text>
          )}
        </Box>
        <Box pl={{ sm: '0', md: '4px' }}>{logoutButton}</Box>
      </>
    );
  }

  return (
    <Box as="nav" padding="1.5rem" bg="teal.500" color="white">
      <Flex
        maxWidth={{ sm: '100%', md: '800px' }}
        flexGrow={1}
        mx="auto"
        justify="space-between"
        wrap="wrap"
        align="center"
      >
        <Flex alignItems="center" justifyContent="space-between" mr={4}>
          <Flex align="center">
            <NextChakraLink href="/">
              <Heading as="h1" size="lg">
                Reddit Clone
              </Heading>
            </NextChakraLink>
          </Flex>
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
          width={{ sm: '100%', md: 'auto' }}
          justifyContent="space-between"
          alignItems="center"
          flexGrow={1}
        >
          <Box display={{ sm: 'block', md: 'flex' }}>
            {!!data?.me && !__isProd__ && (
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
    </Box>
  );
};

export default Header;
