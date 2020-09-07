import { verify } from 'jsonwebtoken';
import { AccessTokenPayload, MyContext } from '../types';
import { MiddlewareFn } from 'type-graphql';
import { ACCESS_TOKEN_SECRET, __bearerRE__ } from '../constants';
import { AuthenticationError } from 'apollo-server-express';

export const auth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new AuthenticationError('missing authorization header');
  }

  const tokenRegExMatch = authorization.match(__bearerRE__);

  if (!tokenRegExMatch) {
    throw new AuthenticationError('invalid token');
  }

  const token = tokenRegExMatch[1];
  try {
    const payload = verify(token, ACCESS_TOKEN_SECRET);
    if (typeof payload === 'object') {
      context.user = payload as AccessTokenPayload;
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AuthenticationError('token expired');
    }
    throw new AuthenticationError('not authenticated');
  }

  return next();
};
