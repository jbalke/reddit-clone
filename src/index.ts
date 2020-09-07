import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { __prod__, __port__ } from './constants';
import { MyContext } from './types';
import { handleLogout, handleRefreshToken } from './handlers/tokens';
import { HelloResolver } from './resolvers/hello';
import cors from 'cors';

const main = async () => {
  const conn = await createConnection();

  const app = express();
  app.use(cors({ origin: 'http://localhost:3000', credentials: true })); //* cors policy applied to all routes globally

  //* Routes
  app.post('/refresh_token', cookieParser(), handleRefreshToken);
  app.post('/logout', handleLogout);

  //* Apollo Server setup
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver, HelloResolver],
      validate: false,
    }),
    context: ({ req, res, user }: MyContext) => ({ req, res, user }),
  });
  server.applyMiddleware({ app, cors: false }); //* setting globally via express middleare instead.
  app.listen(__port__, () => {
    console.log(
      `Server ready at http://localhost:${__port__}${server.graphqlPath}`
    );
  });
};

main();
