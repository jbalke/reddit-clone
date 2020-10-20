import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
  username: string;

  @Index({ unique: true })
  @Column()
  username_lookup: string;

  @Index({ unique: true })
  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Upvote, (upvote) => upvote.user)
  upvotes: Upvote[];

  @Column({ type: 'int', default: 0 })
  tokenVersion: number;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Field(() => Int)
  score: number;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  lastPostAt?: Date;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  isBanned: boolean;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
