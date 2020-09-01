import express, { Request, Response } from 'express';

export interface MyPayload {
  userId: string;
  isAdmin: boolean;
  tokenVersion: number;
}

export interface MyContext {
  req: Request;
  res: Response;
  jwt?: MyPayload;
}
