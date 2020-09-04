import { verify } from 'jsonwebtoken';
import { AccessTokenPayload, MyContext } from '../types';
import { MiddlewareFn } from 'type-graphql';

export const auth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const bearerRE = /^Bearer\s([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+\/=]*)$/i;
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error('missing authoriztion header');
  }

  const token = authorization.match(bearerRE);
  if (!token) {
    throw new Error('invalid token');
  }

  const payload = verify(token[1], process.env.ACCESS_TOKEN_SECRET!);
  try {
    if (typeof payload === 'object') {
      context.creds = payload as AccessTokenPayload;
    }
  } catch (err) {
    console.error(err);
    throw new Error('not authenticated');
  }

  return next();
};
