import { Request, Response } from 'express';
import { createLastActiveLoader } from './utils/createLastActiveLoader';
import { createPostLoader } from './utils/createPostLoader';
import { createReplyLoader } from './utils/createReplyLoader';
import { createUpvoteLoader } from './utils/createUpvoteLoader';
import { createUserLoader } from './utils/createUserLoader';

export type RefreshTokenResponse = {
  ok: boolean;
  accessToken: string;
};

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
  bannedUntil: string | null;
  tokenVersion: number;
};

export interface MyContext {
  req: Request;
  res: Response;
  user?: AccessTokenPayload;
  userLoader: ReturnType<typeof createUserLoader>;
  upVoteLoader: ReturnType<typeof createUpvoteLoader>;
  postLoader: ReturnType<typeof createPostLoader>;
  replyLoader: ReturnType<typeof createReplyLoader>;
  lastActiveLoader: ReturnType<typeof createLastActiveLoader>;
}
