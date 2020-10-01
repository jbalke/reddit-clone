import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import theme from '../theme';

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;

//TODO: if banned, don't allow deleting of posts/replies (or voting?)
//TODO: do not allow deleting OP on /post/[id] page (results in an empty page)
//TODO: Fix excessive user table queries on page load (only occurs when logged in!)
//TODO: Limit 1 reply from each person to a post/reply.
//TODO: make replies more compact
//TODO: preserve formatting of post text (enable embedded html?)
//TODO: implement exchange-auth -> https://formidable.com/open-source/urql/docs/api/auth-exchange/
//TODO: Admin functions (lock post, ban user)
//TODO: Look into yup for form validations (https://github.com/jquense/yup, https://www.youtube.com/watch?v=ftLy78R8xrg)
//TODO: User profile page + change details
//TODO: Admin panel (# of users/posts/replies)
