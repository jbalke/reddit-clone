import 'reflect-metadata';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import ormConfig from './ormconfig';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { __prod__ } from './constants';
import { MyContext } from './types';

const main = async () => {
  dotenv.config();
  const PORT = process.env.EXPRESS_PORT;
  const SESSION_SECRET = process.env.SESSION_SECRET!;
  const conn = await createConnection(ormConfig);
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  const app = express();

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ client: redisClient }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // CSRF
        secure: __prod__,
      },
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext) => ({ req, res }),
  });
  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
};

main();
