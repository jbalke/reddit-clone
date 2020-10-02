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
  registerEnumType,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Post, PostInput, PostReplyInput } from '../entities/Post';
import { Upvote } from '../entities/Upvote';
import { User } from '../entities/User';
import { authenticate, authorize, verified } from '../middleware/auth';
import { MyContext } from '../types';

enum Vote {
  UP = 1,
  DOWN = -1,
}

registerEnumType(Vote, {
  name: 'Vote',
  description: 'UP or DOWN vote a post',
});

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@ObjectType()
class PostReplyResponse {
  @Field(() => Post, { nullable: true })
  post?: Post;
  @Field(() => String, { nullable: true })
  error?: string;
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
    @Arg('postId', () => Int) postId: number,
    @Arg('vote', () => Vote) vote: Vote,
    @Ctx() { user }: MyContext
  ) {
    const { userId } = user!;

    const post = await Post.findOne({ where: { id: postId } });

    if (!post || post.authorId === user?.userId) {
      return false;
    }

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
    where p."parentId" is null
    ${cursor ? `and p."createdAt" < $2` : ''}
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

  @Query(() => [Post], { nullable: true })
  @UseMiddleware(authenticate)
  async thread(
    @Arg('id', () => ID) id: string,
    @Arg('maxLevel', () => Int, { defaultValue: 0 }) maxLevel: number
  ): Promise<Post[] | undefined> {
    const posts = await getConnection().query(
      `
WITH RECURSIVE replies (id, title, text, points, "updatedAt", "createdAt", "opId", "parentId", "authorId", replies, "level", path) AS (
  SELECT
    "id", title, text, points, "updatedAt", "createdAt", "opId", "parentId", "authorId", replies, "level", ARRAY["id"]
  FROM 
    reddit.posts
  WHERE
    posts.id = $1
  UNION
  SELECT
    p.id, p.title, p.text, p.points, p."updatedAt", p."createdAt", p."opId", p."parentId", p."authorId", p.replies, p."level", path || p.id
  FROM
    reddit.posts p
  INNER JOIN replies r ON r.id = p."parentId" AND r.level < $2
) 
SELECT
    id, title, text, points, "updatedAt", "createdAt", "opId", "parentId", "authorId", replies, "level"
FROM
  replies
ORDER BY path, "createdAt"
    `,
      [id, maxLevel]
    );

    return posts;
  }

  @Query(() => Post, { nullable: true })
  @UseMiddleware(authenticate)
  async post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    const posts = await getConnection().query(
      `
      SELECT
        *
      FROM 
        reddit.posts
      WHERE
        posts.id = $1
    `,
      [id]
    );

    return posts[0];
  }

  @Mutation(() => Post)
  @UseMiddleware(authorize, verified)
  createPost(
    @Arg('input') input: PostInput,
    @Ctx() { user }: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, authorId: user!.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware([authorize, verified])
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String) title: string,
    @Arg('text', () => String) text: string,
    @Ctx() { user }: MyContext
  ): Promise<Post | undefined> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title: title ? title : undefined, text })
      .where('id = :id and authorId = :userId', { id, userId: user!.userId })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware([authorize, verified])
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Arg('opId', () => Int, { nullable: true }) opId: number | undefined,
    @Ctx() { user }: MyContext
  ): Promise<Boolean> {
    const post = await Post.findOne({ id });

    if (post && post.parentId) {
      await getConnection().transaction(async (tm) => {
        await tm
          .getRepository(Post)
          .update({ id: post.parentId! }, { replies: () => `replies - 1` });

        if (opId) {
          await tm
            .getRepository(Post)
            .update({ id: opId }, { replies: () => `replies - 1` });
        }
      });
    }

    if (user!.isAdmin) {
      await Post.delete({ id });
    } else {
      await Post.delete({ id, authorId: user?.userId });
    }

    return true;
  }

  @Mutation(() => PostReplyResponse)
  @UseMiddleware([authorize, verified])
  async postReply(
    @Arg('input') input: PostReplyInput,
    @Ctx() { user }: MyContext
  ): Promise<PostReplyResponse> {
    const parentPost = await Post.findOne({ id: input.parentId });

    if (!parentPost) {
      return {
        error: 'parent post not found',
      };
    }

    if (parentPost.authorId === user!.userId) {
      return {
        error: 'cannot reply to own post',
      };
    }

    try {
      const post = await getConnection().transaction(async (tm) => {
        await tm
          .getRepository(Post)
          .update({ id: input.parentId }, { replies: parentPost.replies + 1 });

        if (input.opId !== parentPost.id) {
          await tm
            .getRepository(Post)
            .update({ id: input.opId }, { replies: () => 'replies + 1' });
        }

        const result = await tm
          .createQueryBuilder()
          .insert()
          .into(Post)
          .values({
            ...input,
            authorId: user!.userId,
            level: parentPost.level + 1,
          })
          .returning('*')
          .execute();

        return Promise.resolve(result.raw[0] as Post);
      });

      return {
        post,
      };
    } catch (error) {
      console.error(error);
      return { error: 'transaction failed' };
    }
  }
}
