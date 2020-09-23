import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import theme from '../theme';

function MyApp({ Component, pageProps }: any) {
  //* retryExchange takes care of this for us!
  // useEffect(() => {
  //   fetch('http://localhost:4000/refresh_token', {
  //     method: 'POST',
  //     credentials: 'include',
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.ok) {
  //         setAccessToken(data.accessToken);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
