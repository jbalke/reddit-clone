import { PartialNextContext } from 'next-urql';
import { Exchange, Operation } from 'urql';
import { fromPromise, fromValue, map, mergeMap, pipe } from 'wonka';
import { getAccessToken } from '../accessToken';

type RefreshTokenResponse = {
  ok: boolean;
  accessToken: string;
};

const fetchOptionsExchange = (fn: any): Exchange => ({ forward }) => (ops$) => {
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

export function fetchOptions(ctx: PartialNextContext | undefined) {
  return fetchOptionsExchange(async (fetchOptions: any) => {
    try {
      let token = '';
      if (!process.browser && ctx) {
        const cookie = ctx.req?.headers?.cookie;

        try {
          const response = await fetch('http://localhost:4000/refresh_token', {
            method: 'POST',
            credentials: 'include',
            headers: cookie ? { cookie } : undefined,
          });

          const data = (await response.json()) as RefreshTokenResponse;
          token = data.accessToken;
        } catch (error) {
          console.error(error);
        }
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
  });
}
