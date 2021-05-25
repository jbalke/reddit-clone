import { devtoolsExchange } from '@urql/devtools';
import { authExchange } from '@urql/exchange-auth';
import { retryExchange } from '@urql/exchange-retry';
import { PartialNextContext, SSRExchange } from 'next-urql';
import Router from 'next/router';
import { CombinedError, dedupExchange, fetchExchange } from 'urql';
import {
  clearAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
  setAccessToken,
} from '../accessToken';
import { cache } from './cacheExchange';
import { errorExchange } from './errorExchange';
import { fetchOptions } from './fetchOptionsExchange';

const options = {
  initialDelayMs: 1000,
  maxDelayMs: 15000,
  randomDelay: true,
  maxNumberAttempts: 2,
  retryIf: (err: CombinedError): boolean => {
    return err && !!err.networkError;
  },
};

export const getClientConfig = (
  ssrExchange: SSRExchange,
  ctx?: PartialNextContext
): any => {
  return {
    url: process.env.NEXT_PUBLIC_API_URL!,
    exchanges: process.browser
      ? [
          devtoolsExchange,
          dedupExchange,
          cache,
          retryExchange(options), // Use the retryExchange factory to add a new exchange
          errorExchange,
          authExchange<{ token: string }>({
            addAuthToOperation: ({ authState, operation }) => {
              if (!authState || !authState.token) {
                return operation;
              }
              const fetchOptions =
                typeof operation.context.fetchOptions === 'function'
                  ? operation.context.fetchOptions()
                  : operation.context.fetchOptions || {};
              return {
                ...operation,
                context: {
                  ...operation.context,
                  fetchOptions: {
                    ...fetchOptions,
                    headers: {
                      ...fetchOptions.headers,
                      Authorization: `Bearer ${authState.token}`,
                    },
                  },
                },
              };
            },
            willAuthError: ({ authState }) => {
              const willError =
                !authState || isAccessTokenExpired(authState.token);

              return willError;
            },
            didAuthError: ({ error }) => {
              return error.graphQLErrors.some(
                (e) => e.extensions?.code === 'UNAUTHENTICATED'
              );
            },
            getAuth: async ({ authState, mutate }) => {
              if (!authState) {
                let token = getAccessToken() || (await refreshAccessToken());
                if (token) {
                  return { token };
                }
                return null;
              }

              const newAccessToken = await refreshAccessToken();
              if (newAccessToken) {
                setAccessToken(newAccessToken);
                return {
                  token: newAccessToken,
                };
              }

              // otherwise, if refresh fails, log clear storage and log out
              clearAccessToken();
              await mutate(`
              mutate Logout {
                logout
              }`);
              Router.push('/login');

              return null;
            },
          }),
          fetchOptions(ctx),
          ssrExchange,
          fetchExchange,
        ]
      : [
          dedupExchange,
          cache,
          authExchange<{ token: string }>({
            addAuthToOperation: ({ authState, operation }) => {
              if (!authState || !authState.token) {
                return operation;
              }
              const fetchOptions =
                typeof operation.context.fetchOptions === 'function'
                  ? operation.context.fetchOptions()
                  : operation.context.fetchOptions || {};
              return {
                ...operation,
                context: {
                  ...operation.context,
                  fetchOptions: {
                    ...fetchOptions,
                    headers: {
                      ...fetchOptions.headers,
                      Authorization: `Bearer ${authState.token}`,
                    },
                  },
                },
              };
            },
            willAuthError: ({ authState }) => {
              const willError =
                !authState || isAccessTokenExpired(authState.token);

              return willError;
            },
            didAuthError: ({ error }) => {
              return error.graphQLErrors.some(
                (e) => e.extensions?.code === 'UNAUTHENTICATED'
              );
            },
            getAuth: async ({ authState, mutate }) => {
              if (!authState) {
                let token = getAccessToken() || (await refreshAccessToken());

                if (token) {
                  return { token };
                }
                return null;
              }

              const newAccessToken = await refreshAccessToken();
              if (newAccessToken) {
                setAccessToken(newAccessToken);
                return {
                  token: newAccessToken,
                };
              }

              // otherwise, if refresh fails, log clear storage and log out
              clearAccessToken();
              await mutate(`
              mutate Logout {
                logout
              }`);
              Router.push(`/login`);

              return null;
            },
          }),
          fetchOptions(ctx),
          ssrExchange,
          fetchExchange,
        ],
  };
};
