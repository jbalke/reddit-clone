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
import { authenticate } from '../middleware/auth';

@ObjectType()
class Payload implements AccessTokenPayload {
  @Field(() => ID)
  userId: string;
  @Field()
  isAdmin: boolean;
  @Field(() => String, { nullable: true })
  bannedUntil: string | null;
  @Field()
  tokenVersion: number;
}
@ObjectType()
class PayloadResponse {
  @Field(() => Payload, { nullable: true })
  jwt: Payload;
}
@Resolver()
export class HelloResolver {
  @Query(() => PayloadResponse)
  @UseMiddleware(authenticate)
  token(@Ctx() { user }: MyContext): PayloadResponse {
    return { jwt: user! };
  }
}
