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
export class ReplyPostInput {
  @Field(() => ID)
  parentId: string;
  @Field()
  text: string;
}

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  title: string | null;

  @Field()
  @Column('text')
  text: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  points: number;

  @Column()
  authorId: string;

  @Field()
  @ManyToOne(() => User, (author) => author.posts)
  author: User;

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  parentId: string | null;

  @Field(() => Int)
  level: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  replies: number;

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
