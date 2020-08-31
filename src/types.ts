import express, { Request, Response } from 'express';

export interface MyPayload {
  userId: number;
  isAdmin: boolean;
}

export interface MyContext {
  req: Request;
  res: Response;
  payload?: MyPayload;
}
