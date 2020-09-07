import { ThemeProvider, CSSReset, Box } from '@chakra-ui/core';
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
        authorization: token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
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
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
