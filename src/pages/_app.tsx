import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { NextUrqlAppContext, withUrqlClient } from 'next-urql';
import NextApp from 'next/app';
import React, { useEffect, useState } from 'react';
import { __postThrottleSeconds__ } from '../constants';
import { useMeQuery } from '../generated/graphql';
import { MyContext, Notification } from '../myContext';
import theme from '../theme';
import { getClientConfig } from '../urql/urqlConfig';

function MyApp({ Component, resetUrqlClient, pageProps }: any) {
  const [notification, setNotification] = useState<Notification>({});
  const [secondsUntilNewPost, setSecondsUntilNewPost] = useState(0);
  const [{ data }] = useMeQuery();

  let timeoutId: any = null;
  useEffect(() => {
    const lastPostAt = data?.me?.lastPostAt;
    if (lastPostAt) {
      const secondsSinceLastPost = Math.floor(
        (Date.now() - new Date(lastPostAt).getTime()) / 1000
      );

      if (secondsSinceLastPost < __postThrottleSeconds__) {
        setSecondsUntilNewPost(__postThrottleSeconds__ - secondsSinceLastPost);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(
          (secondsRemaining) => {
            setSecondsUntilNewPost(secondsRemaining - 1);
          },
          1000,
          secondsUntilNewPost
        );
        return;
      }
    }
    setSecondsUntilNewPost(0);

    return () => {
      if (timeoutId) clearInterval(timeoutId);
    };
  }, [data, secondsUntilNewPost]);

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <MyContext.Provider
        value={{
          resetUrqlClient,
          notification,
          setNotification,
          secondsUntilNewPost,
        }}
      >
        <Component {...pageProps} />
        <div id="portal"></div>
      </MyContext.Provider>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (ctx: NextUrqlAppContext) => {
  const appProps = await NextApp.getInitialProps(ctx);

  return {
    ...appProps,
  };
};

export default withUrqlClient(getClientConfig, {
  neverSuspend: true,
})(
  // @ts-ignore
  MyApp
);

//TODO: BUG: urql is duplicating operations
//TODO: User profile stats: posts, replies, joined date, score/votes
//TODO: Allow change email address, password.
//TODO: Admin functions (lock post, ban user)
//TODO: Admin panel (# of users/posts/replies)
//TODO: Load more posts on scroll
//TODO: dark mode
