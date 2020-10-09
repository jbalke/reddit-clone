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
import { __PostThrottleSeconds__ } from '../constants';
import { Post } from '../entities/Post';
import { Upvote } from '../entities/Upvote';
import { User } from '../entities/User';
import { authenticate, authorize, verified } from '../middleware/auth';
import { MyContext } from '../types';
import {
  validatePost,
  validateReply,
  validateUpdatePost,
} from '../utils/validatePost';
import { FieldError } from './types';

enum Vote {
  UP = 1,
  DOWN = -1,
}

registerEnumType(Vote, {
  name: 'Vote',
  description: 'UP or DOWN vote a post',
});

@InputType()
export class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@InputType()
export class PostReplyInput {
  @Field(() => Int)
  parentId: number;
  @Field()
  text: string;
  @Field(() => Int)
  originalPostId: number;
}

@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  id: number;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@ObjectType()
class PostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Post, { nullable: true })
  post?: Post;
}

@ObjectType()
class PostReplyResponse {
  @Field(() => Post, { nullable: true })
  post?: Post;
  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
class DeletePostResponse {
  @Field()
  success: boolean;
  @Field(() => String, { nullable: true })
  error?: string;
}

@Resolver((of) => Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.length > 150 ? post.text.slice(0, 150) + '...' : post.text;
  }

  @FieldResolver(() => Post)
  originalPost(@Root() post: Post, @Ctx() { postLoader }: MyContext) {
    if (!post.originalPostId) {
      return;
    }
    return postLoader.load(post.originalPostId);
  }

  @FieldResolver(() => Post)
  parent(@Root() post: Post, @Ctx() { postLoader }: MyContext) {
    if (!post.parentId) {
      return;
    }
    return postLoader.load(post.parentId);
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

  @FieldResolver(() => Post, { nullable: true })
  async reply(@Root() post: Post, @Ctx() { replyLoader, user }: MyContext) {
    if (!user?.userId) {
      return null;
    }

    return await replyLoader.load({ parentId: post.id, authorId: user.userId });
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
            .set({ score: () => `score + ${vote * 2}` })
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
            .set({
              score: () => `score + ${vote}`,
              voteCount: () => `"voteCount" + 1`,
            })
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
WITH RECURSIVE replies (id, title, text, score, "voteCount", "updatedAt", "createdAt", "originalPostId", "parentId", "authorId", replies, "level", path) AS (
  SELECT
    "id", title, text, score, "voteCount", "updatedAt", "createdAt", "originalPostId", "parentId", "authorId", replies, "level", ARRAY["id"]
  FROM 
    reddit.posts
  WHERE
    posts.id = $1
  UNION
  SELECT
    p.id, p.title, p.text, p.score, p."voteCount", p."updatedAt", p."createdAt", p."originalPostId", p."parentId", p."authorId", p.replies, p."level", path || p.id
  FROM
    reddit.posts p
  INNER JOIN replies r ON r.id = p."parentId" AND r.level < $2
) 
SELECT
    id, title, text, score, "voteCount", "updatedAt", "createdAt", "originalPostId", "parentId", "authorId", replies, "level"
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

  @Mutation(() => PostResponse)
  @UseMiddleware([authorize, verified])
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() { user: creds }: MyContext
  ): Promise<PostResponse> {
    const errors = validatePost(input);
    if (errors.length) {
      return {
        errors,
      };
    }

    //throttle user
    const user = await User.findOne(creds!.userId);
    if (
      user?.lastPostAt &&
      Date.now() - user.lastPostAt.getTime() < 1000 * __PostThrottleSeconds__
    ) {
      throw new Error(
        `please allow ${__PostThrottleSeconds__} seconds between posts`
      );
    }

    User.update({ id: creds!.userId }, { lastPostAt: new Date() });

    return {
      post: await Post.create({ ...input, authorId: creds!.userId }).save(),
    };
  }

  @Mutation(() => PostResponse)
  @UseMiddleware([authorize, verified])
  async updatePost(
    @Arg('input') input: UpdatePostInput,
    @Ctx() { user }: MyContext
  ): Promise<PostResponse> {
    const { id, text } = input;
    const errors = validateUpdatePost(input);
    if (errors.length) {
      return {
        errors,
      };
    }
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ text })
      .where('id = :id and authorId = :userId', { id, userId: user!.userId })
      .returning('*')
      .execute();

    return { post: result.raw[0] };
  }

  @Mutation(() => DeletePostResponse)
  @UseMiddleware([authorize, verified])
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: MyContext
  ): Promise<DeletePostResponse> {
    const post = await Post.findOne({ id });

    if (post) {
      if (post.replies !== 0) {
        return {
          success: false,
          error: 'post has replies',
        };
      }
      if (post.parentId) {
        await getConnection().transaction(async (tm) => {
          await tm
            .getRepository(Post)
            .update({ id: post.parentId! }, { replies: () => `replies - 1` });

          if (post.originalPostId && post.originalPostId !== post.parentId) {
            await tm
              .getRepository(Post)
              .update(
                { id: post.originalPostId },
                { replies: () => `replies - 1` }
              );
          }
        });
      }

      if (user!.isAdmin) {
        await Post.delete({ id });
      } else {
        await Post.delete({ id, authorId: user?.userId });
      }
    }

    return {
      success: true,
    };
  }

  @Mutation(() => PostReplyResponse)
  @UseMiddleware([authorize, verified])
  async postReply(
    @Arg('input') input: PostReplyInput,
    @Ctx() { user }: MyContext
  ): Promise<PostReplyResponse> {
    const errors = validateReply(input);
    if (errors) {
      return {
        error: errors[0].message,
      };
    }
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

    const ownReply = await Post.findOne({
      where: { parentId: input.parentId, authorId: user?.userId },
    });
    if (ownReply) {
      return {
        error: 'you may only reply once to a post or reply',
      };
    }

    try {
      const post = await getConnection().transaction(async (tm) => {
        await tm
          .getRepository(Post)
          .update({ id: input.parentId }, { replies: parentPost.replies + 1 });

        if (input.originalPostId !== parentPost.id) {
          await tm.getRepository(Post).update(
            { id: input.originalPostId },

            { replies: () => 'replies + 1' }
          );
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
