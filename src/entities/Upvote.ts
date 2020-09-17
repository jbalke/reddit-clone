import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity('upvotes')
export class Upvote extends BaseEntity {
  @Column('int')
  value: number;

  @PrimaryColumn()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;

  @PrimaryColumn()
  postId: string;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.upvotes)
  post: Post;
}
