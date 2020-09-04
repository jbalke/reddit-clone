import { AccessTokenPayload, MyContext } from '../types';
import {
  Ctx,
  Field,
  ID,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { auth } from '../middleware/auth';

@ObjectType()
class Payload implements AccessTokenPayload {
  @Field(() => ID)
  userId: string;
  @Field()
  isAdmin: boolean;
}
@ObjectType()
class PayloadResponse {
  @Field(() => Payload, { nullable: true })
  jwt: Payload;
}
@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello() {
    return 'hello world';
  }

  @Query(() => PayloadResponse)
  @UseMiddleware(auth)
  token(@Ctx() { creds }: MyContext): PayloadResponse {
    return { jwt: creds! };
  }
}
