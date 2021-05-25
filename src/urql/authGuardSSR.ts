import { IncomingMessage, ServerResponse } from 'http';
import { NextPage } from 'next';
import { NextUrqlPageContext } from 'next-urql';
import { MeQuery } from '../generated/graphql';

export const AuthGuardSSR = (page: NextPage) => {
  //@ts-ignore
  page.getInitialProps = async ({
    urqlClient,
    res,
    req,
  }: NextUrqlPageContext) => {
    let result;
    try {
      result = await urqlClient
        .query<MeQuery>(
          `
      {
        me {
          id
          verified
          bannedUntil
        }
      }
      `
        )
        .toPromise();

      if (result.data?.me?.verified && !result.data?.me?.bannedUntil) {
        return {};
      }
      if (result && res && req) {
        if (result.data?.me?.bannedUntil) {
          redirectToBanned(res);
        } else if (result.data?.me?.verified === false) {
          redirectToVerification(res);
        } else {
          redirectToLogin(res, req);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return {};
  };

  function redirectToBanned(res: ServerResponse) {
    res.writeHead(302, { Location: '/banned' });
    res.end();
  }

  function redirectToLogin(res: ServerResponse, req: IncomingMessage) {
    res.writeHead(302, { Location: '/login?next=' + req.url });
    res.end();
  }

  function redirectToVerification(res: ServerResponse) {
    res.writeHead(302, { Location: '/resend-verification' });
    res.end();
  }

  return page;
};
