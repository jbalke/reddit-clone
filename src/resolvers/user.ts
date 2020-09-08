import { User } from '../entities/User';
import {
  Arg,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import argon2 from 'argon2';
import { MyContext } from '../types';
import { createAccessToken, createRefreshToken } from '../tokens';
import { __emailRE__, __maxAge__ } from '../constants';
import { clearRefreshCookie, sendRefreshToken } from '../handlers/tokens';
import { auth } from '../middleware/auth';

interface Credentials {
  username: string;
  email: string;
  password: string;
}

@InputType()
class UserRegisterInput implements Credentials {
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
  emailOrUsername: string;
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
  @Query(() => User, { nullable: true })
  @UseMiddleware(auth)
  me(@Ctx() { user }: MyContext): Promise<User | undefined> {
    return User.findOne({ id: user!.userId });
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  user(@Arg('id', () => ID) id: string): Promise<User | undefined> {
    return User.findOne({ id });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserRegisterInput,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    options.username = options.username.replace(' ', '').trim();
    const errors = validateCredentials(options);

    if (errors.length !== 0) {
      return { errors };
    }

    const existingUsername = await User.findOne({
      username_lookup: options.username.toLowerCase(),
    });
    if (existingUsername) {
      errors.push({ field: 'username', message: 'username not available' });
    }

    const existingEmail = await User.findOne({
      email: options.email.toLowerCase(),
    });

    if (existingEmail) {
      errors.push({ field: 'email', message: 'email already registered' });
    }

    if (errors.length !== 0) {
      return {
        errors,
      };
    }

    const user = new User();
    user.username = options.username;
    user.username_lookup = options.username.toLowerCase();
    user.email = options.email.toLowerCase();
    try {
      const hashedPassword = await argon2.hash(options.password);
      user.password = hashedPassword;
    } catch (err) {
      throw new Error(err.message);
    }

    try {
      await user.save();
    } catch (err) {
      console.error(err);
      throw new Error(`unable to create user`);
    }

    sendRefreshToken(res, createRefreshToken(user));
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UserLoginInput,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    let errors: FieldError[];
    const emailOrUsername = options.emailOrUsername.trim().toLowerCase();

    let user = null;
    if (__emailRE__.test(emailOrUsername)) {
      errors = validateCredentials({
        password: options.password,
      });
      if (errors.length !== 0) {
        return { errors };
      }

      user = await User.findOne({
        email: emailOrUsername,
      });
    } else {
      errors = validateCredentials({
        username: emailOrUsername,
        password: options.password,
      });
      if (errors.length !== 0) {
        return { errors };
      }

      user = await User.findOne({
        username_lookup: emailOrUsername,
      });
    }

    if (!user) {
      return {
        errors: [{ field: 'form', message: 'Incorrect login details.' }],
      };
    }
    try {
      const valid = await argon2.verify(user.password, options.password);
      if (!valid) {
        // password did not match
        return {
          errors: [{ field: 'form', message: 'Incorrect login details.' }],
        };
      }
    } catch (err) {
      throw new Error(err.message);
    }

    // password match
    sendRefreshToken(res, createRefreshToken(user));

    return {
      user,
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext) {
    clearRefreshCookie(res);
    return true;
  }

  //! Don't do this in production, revoke tokens when user changes password or triggers 'forget password' flow.
  @Mutation(() => Boolean)
  async revokeRefreshTokenForUser(@Arg('userId', () => ID) userId: string) {
    try {
      await getConnection()
        .getRepository(User)
        .increment({ id: userId }, 'tokenVersion', 1);
    } catch (err) {
      console.error(err);
      return false;
    }

    return true;
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
  async deleteUser(@Arg('id', () => ID) id: string): Promise<Boolean> {
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', { id })
        .returning('*')
        .execute();

      return result.affected! > 0;
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }
}

function validateCredentials({
  email,
  username,
  password,
}: Partial<Credentials>): FieldError[] {
  const errors: FieldError[] = [];
  if (email && !__emailRE__.test(email)) {
    errors.push({
      field: 'email',
      message: 'does not appear to be a valid email address',
    });
  }

  if (username && username.length <= 2) {
    errors.push({
      field: 'username',
      message: 'username must contain 3 or more characters',
    });
  }

  if (password && password.length <= 6) {
    errors.push({
      field: 'password',
      message: 'password length must be greater than 6',
    });
  }

  return errors;
}
