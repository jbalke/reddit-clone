import { Cache, cacheExchange, Resolver } from '@urql/exchange-graphcache';
import gql from 'graphql-tag';
import { stringifyVariables } from 'urql';
import {
  ChangePasswordMutation,
  DeletePostMutationVariables,
  DeletePostResponse,
  LoginMutation,
  MeDocument,
  MeQuery,
  Post,
  PostReplyMutationVariables,
  RegisterMutation,
  Vote,
  VoteMutationVariables,
} from '../generated/graphql';
import schema from '../generated/introspection.json';
import { betterUpdateQuery } from '../utils/betterUpdateQuery';

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
      login: (_result, _args, cache, _info) => {
        const {
          login: { errors },
        } = _result as LoginMutation;
        if (errors) {
          return;
        }
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
        invalidate(cache, 'posts');
      },
      register: (_result, _args, cache, _info) => {
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
      changePassword: (_result, _args, cache, _info) => {
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
      createPost: (_result, _args, cache, _info) => {
        invalidate(cache, 'posts');
      },
      postReply: (_result, args, cache, _info) => {
        invalidate(cache, 'thread');

        const {
          input: { parentId, originalPostId },
        } = args as PostReplyMutationVariables;

        if (parentId !== originalPostId) {
          updateReplies(cache, originalPostId, 1);
        }
      },
      vote: (_result, args, cache, _info) => {
        const { postId, vote } = args as VoteMutationVariables;

        const data = cache.readFragment(
          gql`
            fragment post on Post {
              id
              score
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
            (data.score as number) + (!data.voteStatus ? 1 : 2) * newVoteStatus;
          cache.writeFragment(
            gql`
              fragment updatePost on Post {
                id
                score
                voteStatus
              }
            `,
            { id: postId, score: newPoints, voteStatus: newVoteStatus } as any
          );

          if (!data.voteStatus) {
            incrementVoteCount(cache, postId);
          }
        }
      },
      deletePost: (result, args, cache, _info) => {
        // exit if deletePost mutation was not successful
        const { success } = result.deletePost as DeletePostResponse;
        if (!success) {
          return;
        }

        const { id } = args as DeletePostMutationVariables;

        const data = cache.readFragment(
          gql`
            fragment _post on Post {
              id
              parent {
                id
              }
              originalPost {
                id
              }
            }
          `,
          { id } as any
        );

        if (data) {
          const { originalPost, parent } = data as Post;
          if (parent) {
            updateReplies(cache, parent.id, -1);

            if (originalPost && originalPost.id != parent.id) {
              updateReplies(cache, originalPost.id, -1);
            }
          }
        }

        cache.invalidate({
          __typename: 'Post',
          id,
        });
      },
      updatePost: (_result, _args, cache, _info) => {
        invalidate(cache, 'posts');
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

function invalidate(cache: Cache, fieldName: 'posts' | 'thread') {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', fieldName, fi.arguments || undefined);
  });
}

function updateReplies(cache: Cache, postId: number, change: 1 | -1) {
  const data = cache.readFragment(
    gql`
      fragment replies on Post {
        id
        replies
      }
    `,
    { id: postId } as any
  );

  if (data) {
    cache.writeFragment(
      gql`
        fragment updateReplies on Post {
          replies
        }
      `,
      { id: postId, replies: (data.replies as number) + change } as any
    );
  }
}

function incrementVoteCount(cache: Cache, postId: number) {
  const data = cache.readFragment(
    gql`
      fragment voteCount on Post {
        id
        voteCount
      }
    `,
    { id: postId } as any
  );

  if (data) {
    cache.writeFragment(
      gql`
        fragment incVoteCount on Post {
          voteCount
        }
      `,
      { id: postId, voteCount: (data.voteCount as number) + 1 } as any
    );
  }
}
