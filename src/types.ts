import express, { Request, Response, Express } from 'express';

export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
};
