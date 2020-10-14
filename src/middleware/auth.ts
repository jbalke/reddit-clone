import { verify } from 'jsonwebtoken';
import { AccessTokenPayload, MyContext } from '../types';
import { MiddlewareFn } from 'type-graphql';
import { ACCESS_TOKEN_SECRET, __bearerRE__ } from '../constants';
import { AuthenticationError } from 'apollo-server-express';
import { User } from '../entities/User';

export const verified: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.user?.userId) {
    throw new AuthenticationError('not authenticated');
  }

  const user = await User.findOne({
    id: context.user.userId,
  });

  if (!user) {
    throw new AuthenticationError('not authenticated');
  }

  if (!user.verified) {
    throw new Error('email address not verified');
  }

  return next();
};

export const authorize: MiddlewareFn<MyContext> = ({ context }, next) => {
  requireUserPayload(context);

  if (context.user?.isBanned) {
    throw new Error('user is banned');
  }

  return next();
};

export const admin: MiddlewareFn<MyContext> = ({ context }, next) => {
  const token = requireUserPayload(context);

  if (!token?.isAdmin) {
    throw new AuthenticationError('not authorised');
  }

  return next();
};

export const authenticate: MiddlewareFn<MyContext> = ({ context }, next) => {
  const { authorization } = context.req.headers;

  if (authorization) {
    const tokenRegExMatch = authorization.match(__bearerRE__);

    if (tokenRegExMatch) {
      const token = tokenRegExMatch[1];
      try {
        const payload = verify(token, ACCESS_TOKEN_SECRET);
        if (typeof payload === 'object') {
          context.user = payload as AccessTokenPayload;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  return next();
};

function requireUserPayload(context: MyContext) {
  const { authorization } = context.req.headers;

  if (!authorization) {
    throw new AuthenticationError('missing authorization header');
  }

  const tokenRegExMatch = authorization.match(__bearerRE__);

  if (!tokenRegExMatch) {
    throw new AuthenticationError('invalid token');
  }

  const token = tokenRegExMatch[1];
  let verifiedPayload;
  try {
    const payload = verify(token, ACCESS_TOKEN_SECRET);
    if (typeof payload === 'object') {
      verifiedPayload = payload as AccessTokenPayload;
      context.user = verifiedPayload;
      return verifiedPayload;
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AuthenticationError('token expired');
    }
    throw new AuthenticationError('not authenticated');
  }
  return null;
}
