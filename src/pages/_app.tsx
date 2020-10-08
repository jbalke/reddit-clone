import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React, { useEffect, useState } from 'react';
import theme from '../theme';
import { getClientConfig } from '../urql/urqlConfig';
import { MyContext, Notification } from '../myContext';
import { useMeQuery } from '../generated/graphql';
import { __newPostDelay__ } from '../constants';

function MyApp({ Component, resetUrqlClient, pageProps }: any) {
  const [notification, setNotification] = useState<Notification>({});
  const [minutesUntilNewPost, setMinutesUntilNewPost] = useState(0);
  const [{ data }] = useMeQuery();

  let timeoutId: any = null;
  useEffect(() => {
    const lastPostAt = data?.me?.lastPostAt;
    if (lastPostAt) {
      const minutesSinceLastPost = Math.floor(
        (Date.now() - new Date(lastPostAt).getTime()) / 60000
      );

      if (minutesSinceLastPost < __newPostDelay__) {
        setMinutesUntilNewPost(__newPostDelay__ - minutesSinceLastPost);
        timeoutId = setTimeout(() => {
          setMinutesUntilNewPost(minutesUntilNewPost! - 1);
        }, 60000);
      }
    }

    return () => {
      if (timeoutId) clearInterval(timeoutId);
    };
  }, [data, minutesUntilNewPost]);

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <MyContext.Provider
        value={{
          resetUrqlClient,
          notification,
          setNotification,
        }}
      >
        <Component {...pageProps} minutesUntilNewPost={minutesUntilNewPost} />
      </MyContext.Provider>
    </ThemeProvider>
  );
}

export default withUrqlClient(getClientConfig)(MyApp);

//TODO: preserve formatting of post text (enable embedded html?)
//TODO: if banned, don't allow deleting of posts/replies (or voting?)
//TODO: User profile stats: posts, replies, joined date, score/votes
//TODO: Allow change email address, password.
//TODO: make replies more compact
//TODO: Admin functions (lock post, ban user)
//TODO: Admin panel (# of users/posts/replies)
//TODO: Load more posts on scroll
//TODO: dark mode
