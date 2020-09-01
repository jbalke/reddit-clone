import { verify } from 'jsonwebtoken';
import { MyContext, MyPayload } from '../types';
import { MiddlewareFn } from 'type-graphql';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error('invalid token');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    if (typeof payload === 'object') {
      context.payload = payload as MyPayload;
    }
  } catch (err) {
    console.error(err);
    throw new Error('not authenticated');
  }

  return next();
};
