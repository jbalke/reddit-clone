import 'reflect-metadata';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import { buildSchema, NextFn } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
// import expressJWT from 'express-jwt';
import { __prod__ } from './constants';
import { MyContext, MyPayload } from './types';
import { createAccessToken, createRefreshToken } from './auth';
import { verify } from 'jsonwebtoken';
import { User } from './entities/User';
import { refreshToken } from './tokens';

const main = async () => {
  dotenv.config();
  const PORT = process.env.EXPRESS_PORT;
  const conn = await createConnection();
  const app = express();
  app.use(cookieParser());

  //* Routes
  app.post('/refresh_token', refreshToken);

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext) => ({ req, res }),
  });
  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

main();
