import DataLoader from 'dataloader';
import { Upvote } from '../entities/Upvote';

export const createUpvoteLoader = () =>
  new DataLoader<{ postId: number; userId: string }, Upvote | null>(
    async (keys) => {
      const upvotes = await Upvote.findByIds(keys as any);
      const upvoteIdsToUpvotes: Record<string, Upvote> = {};

      upvotes.forEach(
        (u) => (upvoteIdsToUpvotes[`${u.postId}|${u.userId}`] = u)
      );

      return keys.map(
        (key) => upvoteIdsToUpvotes[`${key.postId}|${key.userId}`]
      );
    }
  );
