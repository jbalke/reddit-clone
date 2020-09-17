import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  Info,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
  registerEnumType,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Post, PostInput } from '../entities/Post';
import { Upvote } from '../entities/Upvote';
import { authorize, authenticate } from '../middleware/auth';
import { MyContext } from '../types';

enum Vote {
  UP,
  DOWN,
}

registerEnumType(Vote, {
  name: 'Vote',
  description: 'UP or DOWN vote a post',
});

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

  @Mutation(() => Boolean)
  @UseMiddleware(authorize)
  async vote(
    @Arg('postId', () => ID) postId: string,
    @Arg('vote', () => Vote) vote: Vote,
    @Ctx() { user }: MyContext
  ) {
    const value = vote === Vote.UP ? 1 : -1;
    try {
      await getConnection().transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager
          .getRepository(Upvote)
          .insert({ userId: user!.userId, postId, value });

        await transactionalEntityManager
          .createQueryBuilder()
          .update(Post)
          .set({ points: () => `points + ${value}` })
          .where('id = :id', { id: postId })
          .execute();
      });
    } catch (error) {
      return false;
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Info() info: any
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const posts = await getConnection().query(
      `
    select p.*,
    json_build_object(
      'id', u.id, 
      'username', u.username, 
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
      ) author
    from reddit.posts p
    inner join reddit.users u on p."authorId" = u.id
    ${cursor ? `where p."createdAt" < '${cursor}'` : ''}
    order by p."createdAt" DESC
    limit ${realLimitPlusOne}
    `
    );

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
  @UseMiddleware(authorize)
  createPost(
    @Arg('input') input: PostInput,
    @Ctx() { user }: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, authorId: user!.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(authorize)
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
  @UseMiddleware(authorize)
  async deletePost(@Arg('id', () => ID) id: string): Promise<Boolean> {
    await Post.delete(id);
    return true;
  }
}
