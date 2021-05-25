import DataLoader from 'dataloader';
import { Post } from '../entities/Post';

export const createReplyLoader = () =>
  new DataLoader<{ parentId: number; authorId: string }, Post | null>(
    async (keys) => {
      const posts = await Post.find(keys as any);
      const postIdToPost: Record<string, Post> = {};

      posts.forEach((p) => (postIdToPost[`${p.parentId}|${p.authorId}`] = p));

      return keys.map((key) => postIdToPost[`${key.parentId}|${key.authorId}`]);
    }
  );
