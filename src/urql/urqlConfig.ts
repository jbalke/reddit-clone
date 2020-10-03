import { devtoolsExchange } from '@urql/devtools';
// import { authExchange } from './authExchange';
import { authExchange } from '@urql/exchange-auth';
import { retryExchange } from '@urql/exchange-retry';
import { NextPageContext } from 'next';
import { SSRExchange } from 'next-urql';
import {
  ClientOptions,
  CombinedError,
  dedupExchange,
  fetchExchange,
} from 'urql';
import {
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
} from '../accessToken';
import { isServer } from '../utils/isServer';
import { cache } from './cacheExchange';
import { errorExchange } from './errorExchange';
import { fetchOptionsExchange } from './fetchOptionsExchange';

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
  ctx?: NextPageContext
): any => {
  return {
    url: 'http://localhost:4000/graphql',
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cache,
      retryExchange(options), // Use the retryExchange factory to add a new exchange
      errorExchange,
      authExchange<{ token: string }>({
        getAuth: async ({ authState }) => {
          if (!authState) {
            let token = getAccessToken() || (await refreshAccessToken());
            if (token) {
              return { token };
            }
            return null;
          }

          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            return {
              token: newAccessToken,
            };
          }

          return null;
        },
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
        didAuthError: ({ error }) => {
          return error.graphQLErrors.some(
            (e) =>
              e.extensions?.code === 'UNAUTHENTICATED' &&
              (e.message === 'token expired' || e.message === 'invalid token')
          );
        },
        willAuthError: ({ authState }) => {
          if (!authState || isAccessTokenExpired()) return true;
          return false;
        },
      }),
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
      ssrExchange,
      fetchExchange,
    ],
  };
};

// const getAuth = async ({ authState, mutate }: any) => {
//   if (!authState) {
//     const token = getAccessToken();
//     if (token) {
//       return { token };
//     }
//     return null;
//   }

//   const newAccessToken = await refreshAccessToken();

//   if (newAccessToken) {
//     return {
//       token: newAccessToken,
//     };
//   }

//   // not able to refresh access token, log user out here.
//   // logout()
//   await logout(mutate, Router);
//   return null;
// };

// const addAuthToOperation = ({ authState, operation }: any) => {
//   if (!authState || !authState.token) {
//     return operation;
//   }
//   const fetchOptions =
//     typeof operation.context.fetchOptions === 'function'
//       ? operation.context.fetchOptions()
//       : operation.context.fetchOptions || {};
//   return {
//     ...operation,
//     context: {
//       ...operation.context,
//       fetchOptions: {
//         ...fetchOptions,
//         headers: {
//           ...fetchOptions.headers,
//           Authorization: `Bearer ${authState.token}`,
//         },
//       },
//     },
//   };
// };

// const didAuthError = ({ error }: { error: CombinedError }) => {
//   return error.graphQLErrors.some(
//     (e) => e.extensions?.code === 'UNAUTHENTICATED'
//   );
// };

// const willAuthError = ({ authState }: any) => {
//   if (!authState || isAccessTokenExpired()) return true;
//   return false;
// };
