import { Request, Response } from 'express';
import { createUpvoteLoader } from './utils/createUpvoteLoader';
import { createUserLoader } from './utils/createUserLoader';

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
  userLoader: ReturnType<typeof createUserLoader>;
  upVoteLoader: ReturnType<typeof createUpvoteLoader>;
}
