import 'reflect-metadata';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
// import ormConfig from './ormconfig';
import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema, NextFn } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
// import expressJWT from 'express-jwt';
import { __prod__ } from './constants';
import { MyContext } from './types';

const main = async () => {
  dotenv.config();
  const PORT = process.env.EXPRESS_PORT;
  const conn = await createConnection();
  const app = express();

  // app.use(
  //   expressJWT({
  //     secret: process.env.ACCESS_TOKEN_SECRET!,
  //     algorithms: ["HS256"],
  //     // audience: "http://localhost:4000/graphql",
  //     // issuer: "http://localhost",
  //     // exp: 60 * 60 * 24 * 365 * 10, //10 years
  //     credentialsRequired: false,
  //   }).unless({ path: ["/token"] })
  // );

  // app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  //   if (err.name === "UnauthorizedError") {
  //     res.status(401).send("invalid token...");
  //   }
  // });

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
