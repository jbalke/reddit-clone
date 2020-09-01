import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { __maxAge__ } from './constants';
import { createAccessToken, createRefreshToken } from './auth';
import { User } from './entities/User';
import { MyPayload } from './types';

export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!) as MyPayload;
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

export function sendRefreshToken(res: Response<any>, token: string) {
  res.cookie('jid', token, {
    httpOnly: true,
    maxAge: __maxAge__,
  });
}
