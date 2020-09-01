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
import { isAuth } from '../middleware/isAuth';

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
  @UseMiddleware(isAuth)
  token(@Ctx() { jwt }: MyContext): PayloadResponse {
    return { jwt: jwt! };
  }
}
