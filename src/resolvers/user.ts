import { User } from '../entities/User';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import argon2 from 'argon2';
import { MyContext } from 'src/types';
import { sign } from 'jsonwebtoken';
import { createAccessToken, createRefreshToken } from '../auth';

@InputType()
class UserRegisterInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
@InputType()
class UserLoginInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  accessToken?: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find({});
  }

  @Query(() => User, { nullable: true })
  user(@Arg('id', () => Int) id: number): Promise<User | undefined> {
    return User.findOne({ id });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserRegisterInput
  ): Promise<UserResponse> {
    const username = options.username.replace(' ', '').trim();
    if (username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'must contain three or more characters',
          },
        ],
      };
    }

    if (options.password.length <= 6) {
      return {
        errors: [
          { field: 'password', message: 'length must be greater than six' },
        ],
      };
    }
    const existingUsername = await User.findOne({
      username_lookup: username.toLowerCase(),
    });
    if (existingUsername) {
      return {
        errors: [{ field: 'username', message: 'not available' }],
      };
    }

    const existingEmail = await User.findOne({
      email: options.email.toLowerCase(),
    });

    if (existingEmail) {
      return {
        errors: [{ field: 'email', message: 'already registered' }],
      };
    }

    const user = new User();
    user.username = username;
    user.username_lookup = username.toLowerCase();
    user.email = options.email.toLowerCase();
    try {
      const hashedPassword = await argon2.hash(options.password);
      user.password = hashedPassword;
    } catch (err) {
      throw new Error(err.message);
    }

    try {
      await user.save();
      return {
        user,
      };
    } catch (err) {
      console.error(err);
      throw new Error('Internal server error: unable to create user');
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UserLoginInput,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      username_lookup: options.username.toLowerCase().trim(),
    });
    if (!user) {
      return {
        errors: [{ field: 'username/password', message: 'incorrect' }],
      };
    }
    try {
      if (await argon2.verify(user.password, options.password)) {
        // password match
        res.cookie('jid', createRefreshToken(user), { httpOnly: true });

        return {
          user,
          accessToken: createAccessToken(user),
        };
      } else {
        // password did not match
        return {
          errors: [{ field: 'username/password', message: 'incorrect' }],
        };
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // @Mutation(() => User, { nullable: true })
  // async updateUser(
  //   @Arg("id") id: number,
  //   @Arg("title", () => String, { nullable: true }) title: string
  // ): Promise<User | undefined> {
  //   const result = await getConnection()
  //     .createQueryBuilder()
  //     .update(User)
  //     .set({ title })
  //     .where("id = :id", { id })
  //     .returning("*")
  //     .execute();

  //   if (result.affected === 0) {
  //     return undefined;
  //   }
  //   return result.raw[0];
  // }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => Int) id: number): Promise<Boolean> {
    const result = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .returning('*')
      .execute();

    if (result.affected === 0) {
      return false;
    }
    return true;
  }
}
