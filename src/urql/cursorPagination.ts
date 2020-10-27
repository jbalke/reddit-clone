import { Resolver } from '@urql/exchange-graphcache';
import { stringifyVariables } from 'urql';
import { PostsQueryVariables } from '../generated/graphql';

export function cursorPagination(): Resolver {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    // get all fields with entityKey 'Query'
    const allFields = cache.inspectFields(entityKey);

    // Filter all Queries with fieldName 'posts'
    const fieldInfos = allFields.filter(
      (info) =>
        info.fieldName === fieldName &&
        (info.arguments as PostsQueryVariables).options.sortOptions?.sortBy ===
          (fieldArgs as PostsQueryVariables).options.sortOptions?.sortBy
    );
    if (fieldInfos.length === 0) {
      return undefined;
    }

    const isItInTheCache = !!cache.resolve(entityKey, fieldName, fieldArgs);
    // if not in cache, mark as partial
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
