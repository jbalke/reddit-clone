import { Request, Response } from 'express';

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

export interface AccessTokenPayload {
  userId: string;
  isAdmin: boolean;
}

export interface MyContext {
  req: Request;
  res: Response;
  creds?: AccessTokenPayload;
}
