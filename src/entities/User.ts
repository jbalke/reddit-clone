import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
  Index,
} from 'typeorm';
import { Post } from './Post';
import { Upvote } from './Upvote';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  username!: string;

  @Index({ unique: true })
  @Column()
  username_lookup: string;

  @Index({ unique: true })
  @Field()
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Field(() => [Post])
  @OneToMany((type) => Post, (post) => post.author)
  posts: Post[];

  @Field(() => [Upvote])
  @OneToMany((type) => Upvote, (upvote) => upvote.user)
  upvotes: Upvote[];

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  tokenVersion: number;

  @Column({ type: 'boolean', default: false })
  verified: boolean;
}
