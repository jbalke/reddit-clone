import dotenv from 'dotenv';
dotenv.config();

export const __hostURL__ = process.env.HOST_URL;
export const __databaseURL__ = process.env.DATABASE_URL;
export const __port__ = process.env.PORT;
export const __cors_origin__ = process.env.WEB_URL;
export const __prod__ = process.env.NODE_ENV === 'production';
export const __maxAge__ = 1000 * 60 * 60 * 24 * 7; //* 7 days
export const __postThrottleSeconds__ = 60; //seconds
export const __webURL__ = process.env.WEB_URL;
export const __app_domain__ = process.env.APP_DOMAIN;

export const COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const __emailRE__ =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const __bearerRE__ =
  /^Bearer\s([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)$/i;

export const __dateStyle__: Intl.DateTimeFormatOptions = {
  month: 'short',
  year: 'numeric',
  day: 'numeric',
  timeZone: 'UTC',
  timeZoneName: 'short',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};
