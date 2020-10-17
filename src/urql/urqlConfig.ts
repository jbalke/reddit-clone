import { devtoolsExchange } from '@urql/devtools';
import { authExchange } from '@urql/exchange-auth';
import { retryExchange } from '@urql/exchange-retry';
import { NextPageContext } from 'next';
import { SSRExchange } from 'next-urql';
import { CombinedError, dedupExchange, fetchExchange } from 'urql';
import {
  clearAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
} from '../accessToken';
import { cache } from './cacheExchange';
import { errorExchange } from './errorExchange';
import { fetchOptions } from './fetchOptionsExchange';
import { authExchange as oldAuthExchange } from './authExchange';
import Router from 'next/router';

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
    exchanges: process.browser
      ? [
          devtoolsExchange,
          dedupExchange,
          cache,
          retryExchange(options), // Use the retryExchange factory to add a new exchange
          errorExchange,
          oldAuthExchange(),
          // authExchange<{ token: string }>({
          //   getAuth: async ({ authState }) => {
          //     if (!authState) {
          //       let token = getAccessToken();
          //       if (token) {
          //         return { token };
          //       }
          //       return null;
          //     }

          //     const newAccessToken = await refreshAccessToken();
          //     if (newAccessToken) {
          //       return {
          //         token: newAccessToken,
          //       };
          //     }
          //     return null;
          //   },
          //   addAuthToOperation: ({ authState, operation }) => {
          //     if (!authState || !authState.token) {
          //       return operation;
          //     }
          //     const fetchOptions =
          //       typeof operation.context.fetchOptions === 'function'
          //         ? operation.context.fetchOptions()
          //         : operation.context.fetchOptions || {};
          //     return {
          //       ...operation,
          //       context: {
          //         ...operation.context,
          //         fetchOptions: {
          //           ...fetchOptions,
          //           headers: {
          //             ...fetchOptions.headers,
          //             Authorization: `Bearer ${authState.token}`,
          //           },
          //         },
          //       },
          //     };
          //   },
          //   didAuthError: ({ error }) => {
          //     return error.graphQLErrors.some(
          //       (e) =>
          //         e.extensions?.code === 'UNAUTHENTICATED' &&
          //         (e.message === 'token expired' ||
          //           e.message === 'invalid token')
          //     );
          //   },
          //   willAuthError: ({ authState }) => {
          //     if (!authState || isAccessTokenExpired()) return true;
          //     return false;
          //   },
          // }),
          fetchOptions(ctx),
          ssrExchange,
          fetchExchange,
        ]
      : [
          dedupExchange,
          cache,
          oldAuthExchange(),
          // authExchange<{ token: string }>({
          //   getAuth: async ({ authState }) => {
          //     if (!authState) {
          //       let token = getAccessToken();
          //       if (token) {
          //         return { token };
          //       }
          //       return null;
          //     }

          //     const newAccessToken = await refreshAccessToken();
          //     if (newAccessToken) {
          //       return {
          //         token: newAccessToken,
          //       };
          //     }
          //     return null;
          //   },
          //   addAuthToOperation: ({ authState, operation }) => {
          //     if (!authState || !authState.token) {
          //       return operation;
          //     }
          //     const fetchOptions =
          //       typeof operation.context.fetchOptions === 'function'
          //         ? operation.context.fetchOptions()
          //         : operation.context.fetchOptions || {};
          //     return {
          //       ...operation,
          //       context: {
          //         ...operation.context,
          //         fetchOptions: {
          //           ...fetchOptions,
          //           headers: {
          //             ...fetchOptions.headers,
          //             Authorization: `Bearer ${authState.token}`,
          //           },
          //         },
          //       },
          //     };
          //   },
          //   didAuthError: ({ error }) => {
          //     return error.graphQLErrors.some(
          //       (e) =>
          //         e.extensions?.code === 'UNAUTHENTICATED' &&
          //         (e.message === 'token expired' ||
          //           e.message === 'invalid token')
          //     );
          //   },
          //   willAuthError: ({ authState }) => {
          //     if (!authState || isAccessTokenExpired()) return true;
          //     return false;
          //   },
          // }),
          fetchOptions(ctx),
          ssrExchange,
          fetchExchange,
        ],
  };
};
