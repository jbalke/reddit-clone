import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React, { useEffect, useState } from 'react';
import theme from '../theme';
import { getClientConfig } from '../urql/urqlConfig';
import { MyContext, Notification } from '../myContext';
import { useMeQuery } from '../generated/graphql';
import { __PostThrottleSeconds__ } from '../constants';

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

      if (secondsSinceLastPost < __PostThrottleSeconds__) {
        setSecondsUntilNewPost(__PostThrottleSeconds__ - secondsSinceLastPost);
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
      } else {
        setSecondsUntilNewPost(0);
      }
    }

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

export default withUrqlClient(getClientConfig)(MyApp);

//TODO: If post has replies, only allow appending updates to post text.
//TODO: if banned, don't allow deleting of posts/replies (or voting?)
//TODO: User profile stats: posts, replies, joined date, score/votes
//TODO: Allow change email address, password.
//TODO: make replies more compact
//TODO: Admin functions (lock post, ban user)
//TODO: Admin panel (# of users/posts/replies)
//TODO: Load more posts on scroll
//TODO: dark mode
