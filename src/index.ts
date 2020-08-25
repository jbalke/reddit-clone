import 'reflect-metadata';
import dotenv from 'dotenv';
import { createConnection, Connection } from 'typeorm';
import ormConfig from './ormconfig';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { Post } from './entities/Post';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
  dotenv.config();
  const PORT = process.env.EXPRESS_PORT;

  const conn: Connection = await createConnection(ormConfig);

  const app = express();
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });

  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
};

main();
