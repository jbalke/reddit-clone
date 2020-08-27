import 'reflect-metadata';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import ormConfig from './ormconfig';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';

const main = async () => {
  dotenv.config();
  const PORT = process.env.EXPRESS_PORT;
  const conn = await createConnection(ormConfig);

  const app = express();
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false,
    }),
  });

  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
};

main();
