import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import {
  __maxAge__,
  COOKIE_NAME,
  REFRESH_TOKEN_SECRET,
  __prod__,
} from '../constants';
import { createAccessToken, createRefreshToken } from '../tokens';
import { User } from '../entities/User';
import { RefreshTokenPayload } from '../types';

export async function handleRefreshToken(req: Request, res: Response) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload;
  try {
    payload = verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  } catch (err) {
    console.error(err);
    return res.send({ ok: false, accessToken: '' });
  }

  const user = await User.findOne(payload.userId);
  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  sendRefreshToken(res, createRefreshToken(user));
  return res.send({ ok: true, accessToken: createAccessToken(user) });
}

export function sendRefreshToken(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: __maxAge__,
    sameSite: 'strict',
    secure: __prod__,
    // path: '/refresh_token',
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, {
    // path: '/refresh_token',
  });
}
