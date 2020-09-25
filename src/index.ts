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
import { handleRefreshToken } from './handlers/tokens';
import { HelloResolver } from './resolvers/hello';
import cors from 'cors';
import { createUserLoader } from './utils/createUserLoader';
import { createUpvoteLoader } from './utils/createUpvoteLoader';

const main = async () => {
  const conn = await createConnection();
  //* Run new migrations (i.e. initial db creation)
  // await conn.runMigrations();

  const app = express();
  app.use(cors({ origin: 'http://localhost:3000', credentials: true })); //* cors policy applied to all routes globally

  //* Routes
  app.post('/refresh_token', cookieParser(), handleRefreshToken);

  //* Apollo Server setup
  const server = new ApolloServer({
    introspection: !__prod__,
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver, HelloResolver],
      validate: false,
    }),
    context: ({ req, res, user }: MyContext) => ({
      req,
      res,
      user,
      userLoader: createUserLoader(),
      upVoteLoader: createUpvoteLoader(),
    }),
  });
  server.applyMiddleware({ app, cors: false }); //* setting globally via express middleare instead.
  app.listen(parseInt(__port__), () => {
    console.log(
      `Server ready at http://localhost:${__port__}${server.graphqlPath}`
    );
  });
};

main();
