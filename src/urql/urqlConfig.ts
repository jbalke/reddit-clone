import { retryExchange } from '@urql/exchange-retry';
import { CombinedError, dedupExchange, fetchExchange } from 'urql';
import { getAccessToken } from '../accessToken';
import { isServer } from '../utils/isServer';
import { authExchange } from './authExchange';
import { cache } from './cacheExchange';
import { errorExchange } from './errorExchange';
import { fetchOptionsExchange } from './fetchOptionsExchange';
import { devtoolsExchange } from '@urql/devtools';

const options = {
  initialDelayMs: 1000,
  maxDelayMs: 15000,
  randomDelay: true,
  maxNumberAttempts: 2,
  retryIf: (err: CombinedError): boolean => {
    return err && !!err.networkError;
  },
};

export const getClientConfig = (ssrExchange: any, ctx: any) => {
  return {
    url: 'http://localhost:4000/graphql',
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cache,
      retryExchange(options), // Use the retryExchange factory to add a new exchange
      authExchange(),
      fetchOptionsExchange(async (fetchOptions: any) => {
        try {
          let token = '';
          if (isServer() && ctx) {
            const cookie = ctx.req?.headers?.cookie;

            const response = await fetch(
              'http://localhost:4000/refresh_token',
              {
                method: 'POST',
                credentials: 'include',
                headers: cookie ? { cookie } : undefined,
              }
            );

            const data = await response.json();
            token = data.accessToken;
          } else {
            token = getAccessToken();
          }
          return Promise.resolve({
            ...fetchOptions,
            credentials: 'include',
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          });
        } catch (err) {
          console.error(err);
        }
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
