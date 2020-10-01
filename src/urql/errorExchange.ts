import Router from 'next/router';
import { Exchange } from 'urql';
import { pipe, tap } from 'wonka';

export const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // If the OperationResult has an error send a request to sentry
      if (error) {
        // the error is a CombinedError with networkError and graphqlErrors properties
        if (
          error.graphQLErrors.some(
            (e) =>
              e.extensions?.code === 'UNAUTHENTICATED' &&
              !e.path?.includes('me')
          )
        ) {
          Router.replace(`/login?next=${Router.asPath}`);
        } else if (
          error.graphQLErrors.some((e) => /not verified/i.test(e.message))
        ) {
          Router.push('/resend-verification');
        }
      }
    })
  );
};
