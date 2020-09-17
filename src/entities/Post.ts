import { Field, ID, InputType, ObjectType } from 'type-graphql';
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

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  title: string;

  @Field()
  @Column('text')
  text: string;

  @Field()
  @Column({ type: 'int', default: 0 })
  points: number;

  @Column()
  authorId: string;

  @Field()
  @ManyToOne(() => User, (author) => author.posts)
  author: User;

  @Field(() => [Upvote])
  @OneToMany((type) => Upvote, (upvote) => upvote.post)
  upvotes: Upvote[];

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Index({ unique: false })
  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
