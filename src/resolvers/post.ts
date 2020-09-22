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
import { User } from '../entities/User';
import { authorize, authenticate } from '../middleware/auth';
import { MyContext } from '../types';

enum Vote {
  UP = 1,
  DOWN = -1,
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
  textSnippet(@Root() post: Post) {
    return post.text.length > 150 ? post.text.slice(0, 150) + '...' : post.text;
  }

  @FieldResolver(() => User)
  author(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.authorId);
  }

  @FieldResolver(() => Upvote, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { upVoteLoader, user }: MyContext
  ) {
    if (!user?.userId) {
      return null;
    }

    const upvote = await upVoteLoader.load({
      postId: post.id,
      userId: user.userId,
    });

    return upvote ? upvote.value : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(authorize)
  async vote(
    @Arg('postId', () => ID) postId: string,
    @Arg('vote', () => Vote) vote: Vote,
    @Ctx() { user }: MyContext
  ) {
    const { userId } = user!;

    const upvote = await Upvote.findOne({
      where: { userId, postId },
    });

    if (upvote && upvote.value !== vote) {
      // User has already voted but changed vote
      try {
        await getConnection().transaction(async (tm) => {
          await tm
            .createQueryBuilder()
            .update(Post)
            .set({ points: () => `points + ${vote * 2}` })
            .where('id = :id', { id: postId })
            .execute();

          await tm
            .createQueryBuilder()
            .update(Upvote)
            .set({ value: vote })
            .where('userId = :userId and postId = :postId', {
              userId,
              postId,
            })
            .execute();
        });
      } catch (error) {
        console.error(error);
        return false;
      }
    } else if (!upvote) {
      // Has not voted yet
      try {
        await getConnection().transaction(async (tm) => {
          await tm
            .getRepository(Upvote)
            .insert({ userId, postId, value: vote });

          await tm
            .createQueryBuilder()
            .update(Post)
            .set({ points: () => `points + ${vote}` })
            .where('id = :postId', { postId })
            .execute();
        });
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  @UseMiddleware(authenticate)
  async posts(
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const parameters: any[] = [realLimitPlusOne];
    if (cursor) {
      parameters.push(cursor);
    }

    const posts = await getConnection().query(
      `
    select p.*
    from reddit.posts p
    ${cursor ? `where p."createdAt" < $2` : ''}
    order by p."createdAt" DESC
    limit $1
    `,
      parameters
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  @UseMiddleware(authenticate)
  async post(@Arg('id', () => ID) id: string): Promise<Post | undefined> {
    return await Post.findOne({ id });
  }

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
    @Arg('title', () => String) title: string,
    @Arg('text', () => String) text: string,
    @Ctx() { user }: MyContext
  ): Promise<Post | undefined> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and authorId = :userId', { id, userId: user!.userId })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(authorize)
  async deletePost(
    @Arg('id', () => ID) id: string,
    @Ctx() { user }: MyContext
  ): Promise<Boolean> {
    await Post.delete({ id, authorId: user?.userId });
    return true;
  }
}
