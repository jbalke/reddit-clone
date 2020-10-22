import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { __port__, __prod__ } from './constants';
import { handleRefreshToken } from './handlers/tokens';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types';
import { createLastActiveLoader } from './utils/createLastActiveLoader';
import { createPostLoader } from './utils/createPostLoader';
import { createReplyLoader } from './utils/createReplyLoader';
import { createUpvoteLoader } from './utils/createUpvoteLoader';
import { createUserLoader } from './utils/createUserLoader';

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
      postLoader: createPostLoader(),
      replyLoader: createReplyLoader(),
      lastActiveLoader: createLastActiveLoader(),
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
