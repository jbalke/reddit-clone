import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { ConnectionOptions } from 'typeorm';

export default {
  type: 'postgres',
  schema: 'reddit',
  url:
    'postgresql://crvszsimcvvfhx:e8bf9025437279d0c6ec0e4ecff44c4d4ae3c5be41de6b9e77efac8489ac0bc4@ec2-54-217-236-206.eu-west-1.compute.amazonaws.com:5432/d2rgo7cc92rvsg',
  logging: !__prod__,
  synchronize: !__prod__,
  entities: [Post, User],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  cache: true,
} as ConnectionOptions;
