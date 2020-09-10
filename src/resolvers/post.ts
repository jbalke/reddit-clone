import {
  Arg,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Post } from '../entities/Post';
import { auth } from '../middleware/auth';
import { MyContext } from '../types';

@Resolver((of) => Post)
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find({});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => ID) id: string): Promise<Post | undefined> {
    return Post.findOne({ id });
  }

  // @FieldResolver((of) => User)
  // async author(@Root() post: Post): Promise<User> {
  //   return (await User.findOne(post.author.id))!;
  // }

  @Mutation(() => Post)
  @UseMiddleware(auth)
  createPost(
    @Arg('title') title: string,
    @Arg('authorID', () => String) authorID: string,
    @Ctx() { user }: MyContext
  ): Promise<Post> {
    const post = new Post();
    post.title = title;
    return post.save();
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
