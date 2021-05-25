import { Cache } from '@urql/exchange-graphcache';

export function invalidate(cache: Cache, fieldName: 'posts' | 'thread' | 'me') {
  const allFields = cache.inspectFields('Query');
  const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
  fieldInfos.forEach((fi) => {
    cache.invalidate('Query', fieldName, fi.arguments || undefined);
  });
}
