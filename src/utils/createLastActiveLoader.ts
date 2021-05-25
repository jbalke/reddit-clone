import DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { Post } from '../entities/Post';

export const createLastActiveLoader = () =>
  new DataLoader<string, Date>(async (userIds) => {
    const lastActive = await getRepository(Post)
      .createQueryBuilder('post')
      .select('MAX(post."createdAt")', 'lastActive')
      .addSelect('post."authorId"')
      .where('post."authorId" IN (:...ids)', { ids: userIds as string[] })
      .groupBy('post."authorId"')
      .getRawMany();
    const activityToUserId: Record<string, Date> = {};

    //* must return users in order of provided userIds...
    lastActive.forEach((a) => (activityToUserId[a.authorId] = a.lastActive));

    return userIds.map((userId) => activityToUserId[userId]);
  });
