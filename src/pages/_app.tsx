import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { useEffect, useState } from 'react';
import {
  createClient,
  Provider,
  dedupExchange,
  fetchExchange,
  CombinedError,
} from 'urql';
import {
  cacheExchange,
  Cache,
  QueryInput,
  DataField,
} from '@urql/exchange-graphcache';
import { retryExchange } from '@urql/exchange-retry';
import { authExchange } from '../authExchange';
import { getAccessToken, setAccessToken } from '../accessToken';
import { useRouter } from 'next/router';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';
import Header from '../components/Header';
import theme from '../theme';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  input: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(input, (data) => fn(result, data as any) as any);
}

const cache = cacheExchange({
  keys: {
    PayloadResponse: () => null,
    Payload: () => null,
  },
  updates: {
    Mutation: {
      login: (_result, args, cache, info) => {
        betterUpdateQuery<LoginMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.login.errors) {
              return query;
            } else {
              return {
                me: result.login.user,
              };
            }
          }
        );
      },
      register: (_result, args, cache, info) => {
        betterUpdateQuery<RegisterMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.register.errors) {
              return query;
            } else {
              return {
                me: result.register.user,
              };
            }
          }
        );
      },
      logout: (_result, args, cache, info) => {
        betterUpdateQuery<LogoutMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          () => ({
            me: null,
          })
        );
      },
    },
  },
});

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
    cache,
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
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
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
