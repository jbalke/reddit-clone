import { User } from './entities/User';
import { sign } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  PASSWORD_RESET_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from './constants';
import { verify } from 'jsonwebtoken';

type ResetTokenPayload = {
  userId: string;
  resetToken: string;
};

export const createPasswordResetToken = (user: User, resetToken: string) => {
  return sign({ userId: user.id, resetToken }, PASSWORD_RESET_TOKEN_SECRET, {
    expiresIn: '1d',
  });
};

export const isPasswordResetTokenValid = (
  token: string,
  resetToken: string
): boolean => {
  let payload;
  try {
    payload = verify(token, PASSWORD_RESET_TOKEN_SECRET) as ResetTokenPayload;
    return payload.userId === resetToken;
  } catch (error) {
    return false;
  }
};

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
