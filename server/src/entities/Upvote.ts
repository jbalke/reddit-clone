import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity('upvotes')
@Index(['userId', 'postId'], { unique: true })
export class Upvote extends BaseEntity {
  @Column('int')
  value: number;

  @PrimaryColumn()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.upvotes, { onDelete: 'CASCADE' })
  user: User;

  @PrimaryColumn('int')
  postId: number;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.upvotes, { onDelete: 'CASCADE' })
  post: Post;
}
