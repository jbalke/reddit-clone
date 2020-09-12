import { cacheExchange } from '@urql/exchange-graphcache';
import { retryExchange } from '@urql/exchange-retry';
import { CombinedError, dedupExchange, fetchExchange } from 'urql';
import { getAccessToken } from '../accessToken';
import { authExchange } from '../authExchange';
import {
  ChangePasswordMutation,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const getClientConfig = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: () => {
    const token = getAccessToken();

    return {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
      credentials: 'include' as const,
    };
  },
  exchanges: [
    dedupExchange,
    cache,
    retryExchange(options), // Use the retryExchange factory to add a new exchange
    authExchange(),
    ssrExchange,
    fetchExchange,
  ],
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
      changePassword: (_result, args, cache, info) => {
        betterUpdateQuery<ChangePasswordMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.changePassword.errors) {
              return query;
            } else {
              return {
                me: result.changePassword.user,
              };
            }
          }
        );
      },
    },
  },
});
