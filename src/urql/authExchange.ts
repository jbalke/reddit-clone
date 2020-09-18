import { Exchange, Operation } from 'urql';
import {
  pipe,
  share,
  filter,
  map,
  mergeMap,
  fromPromise,
  fromValue,
  takeUntil,
  onPush,
  merge,
} from 'wonka';
import {
  clearAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
} from '../accessToken';

const addTokenToOperation = (operation: Operation, token: string) => {
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
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
    },
  };
};

/**
  This exchange performs authentication and is a recipe.
  The `getToken` function gets a token, e.g. from memory.
  The `isAccessTokenExpired` function checks whether we need to refresh.
  The `refreshToken` function calls fetch to get a new token and stores it in memory.
  */
export const authExchange = (): Exchange => ({ forward }) => {
  let refreshTokenPromise: Promise<string> | null = null;

  return (ops$) => {
    // We share the operations stream
    const sharedOps$ = pipe(ops$, share);

    const withToken$ = pipe(
      sharedOps$,
      // Filter by non-teardowns
      filter((operation) => operation.operationName !== 'teardown'),
      mergeMap((operation) => {
        // check whether the token is expired
        const isExpired = refreshTokenPromise || isAccessTokenExpired();

        // If it's not expired then just add it to the operation immediately
        if (!isExpired) {
          return fromValue(addTokenToOperation(operation, getAccessToken()));
        }

        // If it's expired and we aren't refreshing it yet, start refreshing it
        if (isExpired && !refreshTokenPromise) {
          refreshTokenPromise = refreshAccessToken(); // we share the promise
        }

        const { key } = operation;
        // Listen for cancellation events for this operation
        const teardown$ = pipe(
          sharedOps$,
          filter((op) => op.operationName === 'teardown' && op.key === key)
        );

        return pipe(
          fromPromise(refreshTokenPromise!),
          // Don't bother to forward the operation, if it has been cancelled
          // while we were refreshing
          takeUntil(teardown$),
          map((token) => {
            refreshTokenPromise = null; // reset the promise variable
            return addTokenToOperation(operation, token);
          })
        );
      })
    );

    // We don't need to do anything for teardown operations
    const withoutToken$ = pipe(
      sharedOps$,
      filter((operation) => operation.operationName === 'teardown')
    );

    return pipe(
      merge([withToken$, withoutToken$]),
      forward,
      onPush((result) => {
        if (
          result.error?.networkError ||
          result.error?.graphQLErrors.some((e) => e.message == 'token expired')
        ) {
          clearAccessToken(); // here you'd invalidate your local token synchronously
          // this is so our pretend `isAccessTokenExpired()` function returns `true` next time around
        }
      })
    );
  };
};
