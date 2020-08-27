import { Post } from '../entities/Post';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find({});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne({ id });
  }

  @Mutation(() => Post)
  createPost(@Arg('title') title: string): Promise<Post> {
    const post = new Post();
    post.title = title;
    return post.save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
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
  async deletePost(@Arg('id') id: number): Promise<Boolean> {
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
