declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    NODE_ENV: 'development' | 'production';
    PORT: string;
    HOST_URL: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_COOKIE_NAME: string;
    WEB_URL: string;
  }
}
