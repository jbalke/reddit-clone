import dotenv from 'dotenv';
dotenv.config();

export const __port__ = process.env.PORT!;
export const __prod__ = process.env.NODE_ENV === 'production';
export const __maxAge__ = 1000 * 60 * 60 * 24 * 7; //* 7 days
export const __PostThrottleSeconds__ = 20; //seconds

export const COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME!;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const __emailRE__ = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const __bearerRE__ = /^Bearer\s([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+\/=]*)$/i;
