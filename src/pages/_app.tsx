import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import theme from '../theme';
import { getClientConfig } from '../urql/urqlConfig';
import { MyContext, Notification } from '../myContext';

function MyApp({ Component, resetUrqlClient, pageProps }: any) {
  const [notification, setNotification] = useState<Notification>({});

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <MyContext.Provider
        value={{ resetUrqlClient, notification, setNotification }}
      >
        <Component {...pageProps} />
      </MyContext.Provider>
    </ThemeProvider>
  );
}

export default withUrqlClient(getClientConfig)(MyApp);

//TODO: preserve formatting of post text (enable embedded html?)
//TODO: if banned, don't allow deleting of posts/replies (or voting?)
//TODO: User profile stats: posts, replies, joined date, score/votes
//TODO: Allow change email address, password.
//TODO: Load more posts on scroll
//TODO: Fix excessive user table queries on page load (only occurs when logged in!)
//TODO: make replies more compact
//TODO: dark mode
//TODO: Admin functions (lock post, ban user)
//TODO: Look into yup for form validations (https://github.com/jquense/yup, https://www.youtube.com/watch?v=ftLy78R8xrg)
//TODO: Admin panel (# of users/posts/replies)
