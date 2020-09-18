import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { retryExchange } from '@urql/exchange-retry';
import {
  CombinedError,
  dedupExchange,
  Exchange,
  fetchExchange,
  Operation,
  stringifyVariables,
} from 'urql';
import { getAccessToken } from '../accessToken';
import {
  ChangePasswordMutation,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  Vote,
  VoteMutation,
  VoteMutationVariables,
} from '../generated/graphql';
import { betterUpdateQuery } from '../utils/betterUpdateQuery';
import { isServer } from '../utils/isServer';
import { authExchange } from './authExchange';
import { errorExchange } from './errorExchange';
import { pipe, mergeMap, fromPromise, fromValue, map } from 'wonka';
import gql from 'graphql-tag';

export const fetchOptionsExchange = (fn: any): Exchange => ({ forward }) => (
  ops$
) => {
  return pipe(
    ops$,
    mergeMap((operation: Operation) => {
      const result = fn(operation.context.fetchOptions);
      return pipe(
        (typeof result.then === 'function'
          ? fromPromise(result)
          : fromValue(result)) as any,
        map((fetchOptions: RequestInit | (() => RequestInit)) => ({
          ...operation,
          context: { ...operation.context, fetchOptions },
        }))
      );
    }),
    forward
  );
};

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

export const getClientConfig = (ssrExchange: any, ctx: any) => {
  return {
    url: 'http://localhost:4000/graphql',
    exchanges: [
      dedupExchange,
      cache,
      retryExchange(options), // Use the retryExchange factory to add a new exchange
      authExchange(),
      fetchOptionsExchange(async (fetchOptions: any) => {
        try {
          let token = '';
          if (isServer() && ctx) {
            const cookie = ctx.req.headers.cookie;

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
      errorExchange,
      fetchExchange,
    ],
  };
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    if (fieldInfos.length === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = !!cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'posts'
    );
    info.partial = !isItInTheCache;

    let hasMore = true;
    const results: string[] = [];

    fieldInfos.forEach((fi) => {
      const field = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(field, 'posts') as string[];

      const _hasMore = cache.resolve(field, 'hasMore');
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }

      results.push(...data);
    });

    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results,
    };
  };
};

const cache = cacheExchange({
  resolvers: {
    Query: {
      posts: cursorPagination(),
    },
  },
  keys: {
    PayloadResponse: () => null,
    Payload: () => null,
    PaginatedPosts: () => null,
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
      createPost: (_result, args, cache, info) => {
        const allFields = cache.inspectFields('Query');
        const fieldInfos = allFields.filter(
          (info) => info.fieldName === 'posts'
        );
        fieldInfos.forEach((fi) => {
          cache.invalidate('Query', 'posts', fi.arguments || undefined);
        });
      },
      vote: (_result, args, cache, info) => {
        const { postId, vote } = args as VoteMutationVariables;

        const data = cache.readFragment(
          gql`
            fragment _ on Post {
              id
              points
              voteStatus
            }
          `,
          { id: postId } as any
        );

        if (data) {
          const newVoteStatus = vote === Vote.Up ? 1 : -1;
          if (data.voteStatus === newVoteStatus) {
            return;
          }
          const newPoints =
            (data.points as number) +
            (!data.voteStatus ? 1 : 2) * newVoteStatus;
          cache.writeFragment(
            gql`
              fragment __ on Post {
                points
                voteStatus
              }
            `,
            { id: postId, points: newPoints, voteStatus: newVoteStatus } as any
          );
        }
      },
    },
  },
});
