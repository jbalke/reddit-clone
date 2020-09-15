import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Post, PostInput } from '../entities/Post';
import { auth } from '../middleware/auth';
import { MyContext } from '../types';

@InputType()
class PostsOptions {
  limit: number;
  cursor: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver((of) => Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.length > 150 ? root.text.slice(0, 150) + '...' : root.text;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder('p')
      .orderBy(`"createdAt"`, 'DESC')
      .take(realLimitPlusOne);

    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(cursor) });
    }

    const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => ID) id: string): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  // @FieldResolver((of) => User)
  // async author(@Root() post: Post): Promise<User> {
  //   return (await User.findOne(post.author.id))!;
  // }

  @Mutation(() => Post)
  @UseMiddleware(auth)
  createPost(
    @Arg('input') input: PostInput,
    @Ctx() { user }: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, authorId: user!.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(auth)
  async updatePost(
    @Arg('id', () => ID) id: string,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { user }: MyContext
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
  @UseMiddleware(auth)
  async deletePost(@Arg('id', () => ID) id: string): Promise<Boolean> {
    await Post.delete(id);
    return true;
  }
}
