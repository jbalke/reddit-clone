import { ThemeProvider, CSSReset, DefaultTheme, Box } from '@chakra-ui/core';
import { useEffect, useState } from 'react';
import {
  createClient,
  Provider,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  CombinedError,
} from 'urql';
import { retryExchange } from '@urql/exchange-retry';
import { authExchange } from '../authExchange';
import { getAccessToken, setAccessToken } from '../accessToken';
import { useRouter } from 'next/router';

import theme from '../theme';
import Header from '../components/Header';
import { Breakpoints } from '../types';

const breakpoints: Breakpoints = ['360px', '768px', '1024px', '1440px'];
breakpoints.sm = breakpoints[0];
breakpoints.md = breakpoints[1];
breakpoints.lg = breakpoints[2];
breakpoints.xl = breakpoints[3];

const myTheme: DefaultTheme = {
  ...theme,
  breakpoints,
};

// None of these options have to be added, these are the default values.
const options = {
  initialDelayMs: 1000,
  maxDelayMs: 15000,
  randomDelay: true,
  maxNumberAttempts: 3,
  retryIf: (err: CombinedError): boolean => {
    if (err.graphQLErrors.some((e) => e.message === 'token expired'))
      return true;

    return err && !!err.networkError;
  },
};

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: () => {
    const token = getAccessToken();

    return {
      headers: {
        credentials: 'include',
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  },
  exchanges: [
    dedupExchange,
    cacheExchange,
    retryExchange(options), // Use the retryExchange factory to add a new exchange
    authExchange(),
    fetchExchange,
  ],
});

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
          router.push('/login');
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        router.push('/login');
        setLoading(false);
      });
  }, []);

  return (
    <Provider value={client}>
      <ThemeProvider theme={myTheme}>
        <CSSReset />
        <Header />
        {loading && <Box>loading...</Box>}
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
