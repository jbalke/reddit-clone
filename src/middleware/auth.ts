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

export const authorize: MiddlewareFn<MyContext> = async ({ context }, next) => {
  await requireUserPayload(context);

  if (context.user?.bannedUntil) {
    throw new Error('user is banned');
  }

  return next();
};

export const admin: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.user?.isAdmin) {
    throw new Error('not authorised');
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

async function requireUserPayload(
  context: MyContext
): Promise<AccessTokenPayload> {
  const { authorization } = context.req.headers;

  if (!authorization) {
    throw new Error('missing authorization header');
  }

  const tokenRegExMatch = authorization.match(__bearerRE__);

  if (!tokenRegExMatch) {
    throw new Error('invalid token');
  }

  const token = tokenRegExMatch[1];
  try {
    const payload = verify(token, ACCESS_TOKEN_SECRET);
    if (typeof payload !== 'object') {
      throw new Error('invalid token payload');
    }

    const verifiedPayload = payload as AccessTokenPayload;
    const user = await User.findOne(verifiedPayload.userId);
    if (!user || user.tokenVersion !== verifiedPayload.tokenVersion) {
      throw new AuthenticationError('token version mismatch');
    }
    context.user = verifiedPayload;
    return verifiedPayload;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AuthenticationError('token expired');
    }
    throw new AuthenticationError('not authenticated');
  }
}
