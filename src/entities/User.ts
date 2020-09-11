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
  @Column('text')
  email!: string;

  @Column('text')
  password!: string;

  @Field(() => [Post])
  @OneToMany((type) => Post, (post) => post.author)
  posts: Post[];

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Column('int', { default: 0 })
  tokenVersion: number;

  @Column('boolean', { default: false })
  verified: boolean;
}
