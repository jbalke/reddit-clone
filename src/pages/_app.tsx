import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import theme from '../theme';
import { getClientConfig } from '../urql/urqlConfig';
import { MyContext } from '../myContext';

function MyApp({ Component, resetUrqlClient, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <MyContext.Provider value={{ resetUrqlClient }}>
        <Component {...pageProps} />
      </MyContext.Provider>
    </ThemeProvider>
  );
}

export default withUrqlClient(getClientConfig)(MyApp);

//TODO: Load more posts on scroll
//TODO: if banned, don't allow deleting of posts/replies (or voting?)
//TODO: Fix excessive user table queries on page load (only occurs when logged in!)
//TODO: Limit 1 reply from each person to a post/reply.
//TODO: make replies more compact
//TODO: preserve formatting of post text (enable embedded html?)
//TODO: Admin functions (lock post, ban user)
//TODO: Look into yup for form validations (https://github.com/jquense/yup, https://www.youtube.com/watch?v=ftLy78R8xrg)
//TODO: User profile page + change details
//TODO: Admin panel (# of users/posts/replies)
