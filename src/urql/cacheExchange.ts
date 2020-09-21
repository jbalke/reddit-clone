import { Cache, cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { stringifyVariables } from 'urql';
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
  ChangePasswordMutation,
  VoteMutationVariables,
  Vote,
  DeletePostMutationVariables,
} from '../generated/graphql';
import schema from './introspection.json';
import { betterUpdateQuery } from '../utils/betterUpdateQuery';
import gql from 'graphql-tag';

export const cache = cacheExchange({
  schema: schema as any,
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
        invalidatePosts(cache);
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
        invalidatePosts(cache);
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
      deletePost: (_result, args, cache, info) => {
        cache.invalidate({
          __typename: 'Post',
          id: (args as DeletePostMutationVariables).id,
        });
      },
    },
  },
});

function cursorPagination(): Resolver {
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
}

function invalidatePosts(cache: Cache) {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', 'posts', fi.arguments || undefined);
  });
}
