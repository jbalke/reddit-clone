import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { retryExchange } from '@urql/exchange-retry';
import {
  CombinedError,
  dedupExchange,
  fetchExchange,
  stringifyVariables,
} from 'urql';
import { getAccessToken } from '../accessToken';
import {
  ChangePasswordMutation,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  Post,
  RegisterMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from '../utils/betterUpdateQuery';
import { authExchange } from './authExchange';
import { errorExchange } from './errorExchange';

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
    errorExchange,
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

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    if (fieldInfos.length === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'posts'
    );
    info.partial = !isItInTheCache;

    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'posts') as string[];
      const _hasMore = cache.resolve(key, 'hasMore');
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
    Post: {
      createdAt(parent, args, cache, info) {
        return new Date(parent.createdAt as string);
      },
      updatedAt(parent, args, cache, info) {
        return new Date(parent.updatedAt as string);
      },
    },
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
      // createPost: (_result, args, cache, info) => {
      //   betterUpdateQuery<CreatePostMutation, PostsQuery>(
      //     cache,
      //     { query: PostsDocument },
      //     _result,
      //     (result, query) => {
      //         return {
      //           posts: result.createPost.,
      //         };
      //       }
      //   )
      // }
    },
  },
});
