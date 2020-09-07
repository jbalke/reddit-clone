import { User } from './entities/User';
import { sign } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './constants';

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id, isAdmin: false }, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
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
