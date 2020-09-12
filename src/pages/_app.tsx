import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import { useEffect } from 'react';
import { setAccessToken } from '../accessToken';
import Header from '../components/Header';
import theme from '../theme';
import { getClientConfig } from '../utils/urqlConfig';

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
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default withUrqlClient(getClientConfig, { ssr: true })(MyApp);
