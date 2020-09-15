import { Field, ID, InputType, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
  @Column('int', { default: 0 })
  points: number;

  @Field()
  @Column()
  authorId: string;

  @Field()
  @ManyToOne(() => User, (author) => author.posts)
  author: User;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
