import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Upvote } from './Upvote';
import { User } from './User';

@InputType()
export class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@InputType()
export class PostReplyInput {
  @Field(() => Int)
  parentId: number;
  @Field()
  text: string;
  @Field(() => Int)
  originalPostId: number;
}

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  title: string | null;

  @Field()
  @Column('text')
  text: string;

  @Column()
  authorId: string;

  @Field(() => User)
  @ManyToOne(() => User, (author) => author.posts)
  author: User;

  @Column({ type: 'int', nullable: true })
  originalPostId: number | null;

  @Field(() => Post, { nullable: true })
  @ManyToOne((type) => Post, (post) => post.replyPosts, { nullable: true })
  originalPost: Post;

  // not implemented
  @OneToMany((type) => Post, (post) => post.originalPost, { nullable: true })
  private replyPosts: Post[];

  @Column({ type: 'int', nullable: true })
  parentId: number | null;

  @Field(() => Post, { nullable: true })
  @ManyToOne((type) => Post, (post) => post.children, { nullable: true })
  parent: Post;

  // not implemented
  @OneToMany((type) => Post, (post) => post.parent, { nullable: true })
  private children: Post[];

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  level: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  replies: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  score: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  voteCount: number;

  @OneToMany((type) => Upvote, (upvote) => upvote.post)
  upvotes: Upvote[];

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field()
  @Index('CREATED_AT_INDEX', { synchronize: false })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
