import 'reflect-metadata';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { __prod__ } from './constants';
import { MyContext } from './types';
import { handleRefreshToken } from './tokens';
import { HelloResolver } from './resolvers/hello';
import cors from 'cors';

const main = async () => {
  dotenv.config();
  const PORT = process.env.EXPRESS_PORT;
  const conn = await createConnection();
  const app = express();
  app.use(cors({ origin: 'http://localhost:3000', credentials: true })); //* cors policy applied to all routes globally
  app.use(cookieParser());

  //* Routes
  app.post('/refresh_token', handleRefreshToken);

  //* Apollo Server setup
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver, HelloResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext) => ({ req, res }),
  });
  server.applyMiddleware({ app, cors: false }); //* setting globally via express middleare instead.
  app.listen(PORT, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

main();
