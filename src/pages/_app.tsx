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

//TODO: Fix voting
//TODO: Fix create post (Variable \"$input\" got invalid value { title: \"Test Post\", text: \"whoop whoop!\", parentId: \"\" }; Field \"parentId\" is not defined by type \"PostInput\")
//TODO: Limit 1 reply from each person to a post/reply and stop ppl up/down voting their own posts.
//TODO: make replies more compact
//TODO: preserve formatting of post text (enable embedded html?)
//TODO: Admin functions (lock post, ban user)
//TODO: Look into yup for form validations (https://github.com/jquense/yup, https://www.youtube.com/watch?v=ftLy78R8xrg)
//TODO: User profile page + change details
//TODO: Admin panel (# of users/posts/replies)
