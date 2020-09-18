import { Request, Response } from 'express';

export type PasswordResetTokenPayload = {
  userId: string;
};

export type RefreshTokenPayload = {
  userId: string;
  tokenVersion: number;
};

export type AccessTokenPayload = {
  userId: string;
  isAdmin: boolean;
};

export interface MyContext {
  req: Request;
  res: Response;
  user?: AccessTokenPayload;
}
