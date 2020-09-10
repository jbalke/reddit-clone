import { withUrqlClient } from 'next-urql';
import { getClientConfig } from '../utils/urqlConfig';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { useEffect, useState } from 'react';
import { setAccessToken } from '../accessToken';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import theme from '../theme';

function MyApp({ Component, pageProps }: any) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:4000/refresh_token', {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setAccessToken(data.accessToken);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default withUrqlClient(getClientConfig, { ssr: true })(MyApp);
