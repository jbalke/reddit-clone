import DataLoader from 'dataloader';
import { getConnection } from 'typeorm';
import { User } from '../entities/User';

export const createUserLoader = () =>
  new DataLoader<string, User>(async (userIds) => {
    const users = await User.findByIds(userIds as string[]);
    const userIdToUser: Record<string, User> = {};

    //* must return users in order of provided userIds...
    users.forEach((u) => (userIdToUser[u.id] = u));

    return userIds.map((userId) => userIdToUser[userId]);
  });
