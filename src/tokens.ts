import { User } from './entities/User';
import { sign } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './constants';
import { verify } from 'jsonwebtoken';

type ResetTokenPayload = {
  userId: string;
};

/** Returns a json web token containing the user's id
 *
 * @param user user object
 * @param expiry Token expiry, defaults to '1d'
 */
export const createPasswordResetToken = (
  user: User,
  expiry: string | number | undefined = '1d'
) => {
  const secret = user.password + '-' + user.createdAt.getTime();
  return sign({ userId: user.id }, secret, {
    expiresIn: expiry,
  });
};

export const verifyPasswordRestToken = (user: User, token: string): boolean => {
  const secret = user.password + '-' + user.createdAt.getTime();

  let payload;
  try {
    payload = verify(token, secret) as ResetTokenPayload;
    return payload.userId === user.id;
  } catch (error) {
    return false;
  }
};

export const createVerifyEmailToken = (
  user: User,
  expiry: string | number | undefined = '1d'
) => {
  const secret = user.password + '-' + user.updatedAt.getTime();
  return sign({ userId: user.id }, secret, {
    expiresIn: expiry,
  });
};

export const verifyVerifyEmailToken = (user: User, token: string): boolean => {
  const secret = user.password + '-' + user.updatedAt.getTime();

  let payload;
  try {
    payload = verify(token, secret) as ResetTokenPayload;
    return payload.userId === user.id;
  } catch (error) {
    return false;
  }
};

export const createAccessToken = (user: User) => {
  return sign(
    { userId: user.id, isAdmin: user.isAdmin, isBanned: user.isBanned },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    }
  );
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );
};
