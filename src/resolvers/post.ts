import { Post } from '../entities/Post';
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  NextFn,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { MyContext, MyPayload } from '../types';
import { isAuth } from '../middleware/isAuth';

@ObjectType()
class Payload implements MyPayload {
  @Field(() => Int)
  userId: number;
  @Field()
  isAdmin: boolean;
}
@ObjectType()
class PayloadResponse {
  @Field(() => Payload, { nullable: true })
  payload: Payload;
}
@Resolver()
export class PostResolver {
  @Query(() => PayloadResponse)
  @UseMiddleware(isAuth)
  ping(@Ctx() { payload }: MyContext): PayloadResponse {
    return { payload: payload! };
  }

  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find({});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne({ id });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(@Arg('title') title: string): Promise<Post> {
    const post = new Post();
    post.title = title;
    return post.save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Post | undefined> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    if (result.affected === 0) {
      return undefined;
    }
    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(@Arg('id', () => Int) id: number): Promise<Boolean> {
    const result = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Post)
      .where('id = :id', { id })
      .returning('*')
      .execute();

    if (result.affected === 0) {
      return false;
    }
    return true;
  }
}
