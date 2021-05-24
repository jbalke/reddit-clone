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
import { __dateStyle__, __postThrottleSeconds__ } from '../constants';
import { Post } from '../entities/Post';
import { Upvote } from '../entities/Upvote';
import { User } from '../entities/User';
import { admin, authenticate, authorize, verified } from '../middleware/auth';
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

enum SortBy {
  AGE = 'createdAt',
  SCORE = 'score',
  VOTES = 'voteCount',
  REPLIES = 'replies',
}

registerEnumType(SortBy, {
  name: 'SortBy',
  description: 'Sort posts',
});

enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(Sort, {
  name: 'Sort',
  description: 'Sort posts ASC or DESC',
});

@InputType()
export class SortOptions {
  @Field(() => SortBy)
  sortBy: SortBy;
  @Field(() => Sort, { nullable: true })
  sortDirection: Sort | null;
}

@InputType()
export class PostsInput {
  @Field(() => Int, { defaultValue: 10 })
  limit: number;
  @Field(() => Cursor, { nullable: true })
  cursor: Cursor | null;
  @Field(() => SortOptions)
  sortOptions: SortOptions;
}

@InputType()
export class Cursor {
  @Field(() => Int, { nullable: true })
  value: number | null;
  @Field(() => String, { nullable: true })
  timeStamp: string | undefined;
}
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
  text(@Root() post: Post, @Ctx() { user }: MyContext) {
    return !!post.flaggedAt && user?.isAdmin
      ? `Flagged ${timestamp(post.flaggedAt)}\n${post.text}`
      : post.flaggedAt
      ? 'This post has been flagged for inappropriate content.'
      : post.text;
  }
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

    if (post.isLocked) {
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

  //https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32
  @Query(() => PaginatedPosts)
  @UseMiddleware(authenticate)
  async posts(@Arg('options') options: PostsInput): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, options.limit);
    const realLimitPlusOne = realLimit + 1;

    const { cursor, sortOptions } = options;
    const parameters: any[] = [realLimitPlusOne];

    if (cursor) {
      parameters.push(cursor.timeStamp);
      if (sortOptions.sortBy !== SortBy.AGE) {
        parameters.push(cursor.value);
      }
    }

    const secondaryOrder =
      sortOptions && sortOptions?.sortBy !== SortBy.AGE
        ? ', "createdAt" DESC'
        : '';

    const posts = await getConnection().query(
      `
    SELECT id, title, text, score, level, "authorId", replies, "updatedAt", "createdAt", "voteCount", "isLocked", "isPinned"
    FROM posts 
    WHERE "parentId" IS NULL AND "flaggedAt" IS NULL
    ${
      cursor && sortOptions.sortBy === SortBy.SCORE
        ? 'AND (score, "createdAt") < ($3, $2)'
        : cursor && sortOptions.sortBy === SortBy.REPLIES
        ? 'AND (replies, "createdAt") < ($3, $2)'
        : cursor
        ? 'AND "createdAt" < $2'
        : ''
    }
    ${
      sortOptions
        ? `ORDER BY "isPinned" DESC, "${sortOptions.sortBy}" ${
            sortOptions.sortDirection || 'DESC'
          } ${secondaryOrder}`
        : 'ORDER BY "isPinned" DESC, "createdAt" DESC'
    }
    LIMIT $1
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
WITH RECURSIVE replies (id, title, text, score, "voteCount", "updatedAt", "createdAt",  "flaggedAt", "originalPostId", "parentId", "authorId", replies, "isPinned", "isLocked", "level", path) AS (
  SELECT
    id, title, text, score, "voteCount", "updatedAt", "createdAt", "flaggedAt", "originalPostId", "parentId", "authorId", replies, "isPinned", "isLocked", "level", ARRAY["id"]
  FROM 
    posts
  WHERE
    posts.id = $1
  UNION
  SELECT
    p.id, p.title, p.text, p.score, p."voteCount", p."updatedAt", p."createdAt", p. "flaggedAt", p."originalPostId", p."parentId", p."authorId", p.replies, p."isPinned",  p."isLocked", p."level", path || p.id
  FROM
    posts p
  INNER JOIN replies r ON r.id = p."parentId" AND r.level < $2
) 
SELECT
    id, title, text, score, "voteCount", "updatedAt", "createdAt", "flaggedAt", "originalPostId", "parentId", "authorId", replies, "isPinned",  "isLocked", "level"
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
        posts
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
      Date.now() - user.lastPostAt.getTime() < 1000 * __postThrottleSeconds__
    ) {
      throw new Error(
        `please allow ${__postThrottleSeconds__} seconds between posts`
      );
    }

    await User.update({ id: creds!.userId }, { lastPostAt: new Date() });

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
    if (errors) {
      return {
        errors,
      };
    }

    const post = await Post.findOne({ where: { id, authorId: user!.userId } });
    if (!post) {
      throw new Error(`unable to find post with id: ${id}`);
    }

    if (post.isLocked) {
      throw new Error('thread is locked');
    }

    if (post.flaggedAt) {
      throw new Error('flagged posts may not be updated');
    }

    const update = getConnection()
      .createQueryBuilder()
      .update(Post)
      .where('id = :id and authorId = :userId', { id, userId: user!.userId })
      .returning('*');

    const timestamp = new Intl.DateTimeFormat('en', __dateStyle__).format(
      new Date()
    );

    let result;
    if (post.replies > 0 || post.voteCount > 0) {
      const updatedText = post.text + `\n\nUPDATED ${timestamp}\n` + input.text;
      result = await update.set({ text: updatedText }).execute();
    } else {
      result = await update.set({ text }).execute();
    }

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
      if (post.isLocked) {
        return {
          success: false,
          error: 'thread is locked',
        };
      }
      if (post.replies !== 0) {
        return {
          success: false,
          error: 'post has replies',
        };
      }
      if (post.flaggedAt) {
        return {
          success: false,
          error: 'flagged posts may not be deleted',
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

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware([authorize, admin])
  async flagPost(@Arg('id', () => Int) id: number): Promise<Post | null> {
    // const result = await Post.update({ id }, { flaggedAt: new Date() });

    const update = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ flaggedAt: new Date() })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    console.log(update);

    return update.raw[0];
  }

  @Mutation(() => [Post], { nullable: true })
  @UseMiddleware([authorize, admin])
  async toggleLockThread(
    @Arg('id', () => Int) id: number
  ): Promise<Post[] | null> {
    const post = await Post.findOne(id);
    if (post) {
      const { originalPostId } = post;

      //toggle isLocked on all thread posts to avoid additional lookups later as thread locking "should" be infrequent.
      const posts = await getConnection().query(
        `
      UPDATE
        posts
      SET 
        "isLocked" = NOT "isLocked"
      WHERE
        id = $1 OR "originalPostId" = $1
      RETURNING *;
    `,
        [originalPostId || id]
      );

      return posts[0];
    }

    return null;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware([authorize, admin])
  async togglePinThread(
    @Arg('id', () => Int) id: number
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (post) {
      const { originalPostId } = post;

      const result = await getConnection().query(
        `
        UPDATE
          posts
        SET
          "isPinned" = NOT "isPinned"
        WHERE
          id = $1
        RETURNING *;
      `,
        [originalPostId ?? id]
      );

      return result[0][0];
    }

    return null;
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

    if (parentPost.isLocked) {
      return {
        error: 'thread is locked',
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

const timestamp = (dt: Date) =>
  new Intl.DateTimeFormat('en', __dateStyle__).format(dt);
