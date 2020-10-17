import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import {
  PASSWORD_RESET_URL,
  VERIFY_EMAIL_URL,
  __emailRE__,
} from '../constants';
import { User } from '../entities/User';
import { clearRefreshCookie, sendRefreshToken } from '../handlers/tokens';
import { admin, authenticate } from '../middleware/auth';
import {
  createAccessToken,
  createPasswordResetToken,
  createRefreshToken,
  createVerifyEmailToken,
  verifyPasswordRestToken,
  verifyVerifyEmailToken,
} from '../tokens';
import { MyContext } from '../types';
import { hashPassword, verifyPasswordHash } from '../utils/passwords';
import { sendEmail } from '../utils/sendEmail';
import { validateCredentials } from '../utils/validateCredentials';
import { FieldError } from './types';

export interface Credentials {
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
class VerifyResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Boolean, { nullable: true })
  verified: boolean;
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

@Resolver((of) => User)
export class UserResolver {
  @FieldResolver(() => String)
  @UseMiddleware(authenticate)
  email(@Root() user: User, @Ctx() { user: creds }: MyContext) {
    // a user can see their own email
    if (creds && (creds.userId === user.id || creds.isAdmin)) {
      return user.email;
    }

    return '';
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('userId', () => ID) userId: string,
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { res }: MyContext
  ) {
    const errors = validateCredentials({ password: newPassword });
    if (errors.length > 0) {
      return {
        errors,
      };
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Token has expired',
          },
        ],
      };
    }

    const isValidToken = verifyPasswordRestToken(user, token);
    if (!isValidToken) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Token has expired',
          },
        ],
      };
    }

    //* increment tokenVersion to invalidate existing refresh tokens.
    user.tokenVersion++;

    await User.update(
      { id: userId },
      {
        password: await hashPassword(newPassword),
        tokenVersion: user.tokenVersion,
      }
    );

    // log user in
    sendRefreshToken(res, createRefreshToken(user));

    return {
      user,
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string, @Ctx() { res }: MyContext) {
    email = email.trim().toLowerCase();
    const errors = validateCredentials({ email });

    if (errors.length !== 0) {
      return false;
    }

    const user = await User.findOne({ email });

    if (!user) {
      return true; //* so as not to tip off malicous actors
    }

    const jwt = createPasswordResetToken(user, '1h');
    const resetPasswordURL = `${PASSWORD_RESET_URL}/${user.id}/${jwt}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: `A password reset has been triggered on your account, please copy and paste this link into your browser to rest your password:
      
${resetPasswordURL}

If you did not request a password reset, you can safely ignore this email.
      `,
      html: `<p>A password reset has been triggered on your account, to continue click the following link:</p>
      <p><a href="${resetPasswordURL}">Reset Password</a></p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      `,
    });
    return true;
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(authenticate)
  me(@Ctx() { user }: MyContext) {
    if (user?.userId) {
      return User.findOne(user!.userId);
    }
    return null;
  }

  @Query(() => [User])
  @UseMiddleware(admin)
  users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(admin)
  user(@Arg('id', () => ID) id: string) {
    return User.findOne(id);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserRegisterInput,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const errors = validateCredentials(options);

    if (errors.length !== 0) {
      return { errors };
    }

    const usernameLookup = options.username.toLowerCase();
    const existingUsername = await User.findOne({
      username_lookup: usernameLookup,
    });
    if (existingUsername) {
      errors.push({ field: 'username', message: 'username not available' });
    }

    const email = options.email.trim().toLowerCase();
    const existingEmail = await User.findOne({
      email,
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
    user.username_lookup = usernameLookup;
    user.email = email;

    try {
      user.password = await hashPassword(options.password);
    } catch (err) {
      throw new Error(err.message);
    }

    try {
      await user.save();
    } catch (err) {
      console.error(err);
      throw new Error(`unable to create user`);
    }

    const jwt = createVerifyEmailToken(user, '3d');
    const verifyUrl = `${VERIFY_EMAIL_URL}/${user.id}/${jwt}`;

    sendEmail(createVerificationEmail(user, verifyUrl));
    sendRefreshToken(res, createRefreshToken(user));

    return {
      user,
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  async sendVerifyEmail(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ email });

    if (user && !user.verified) {
      const jwt = createVerifyEmailToken(user, '3d');
      const verifyUrl = `${VERIFY_EMAIL_URL}/${user.id}/${jwt}`;
      sendEmail(createVerificationEmail(user, verifyUrl));
    }

    return true;
  }

  @Mutation(() => VerifyResponse)
  async verifyEmail(
    @Arg('userId', () => ID) userId: string,
    @Arg('token') token: string,
    @Ctx() { res }: MyContext
  ): Promise<VerifyResponse> {
    const user = await User.findOne({ id: userId });
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Token has expired',
          },
        ],
        verified: false,
      };
    }
    const isValidToken = verifyVerifyEmailToken(user, token);
    if (!isValidToken) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Token has expired',
          },
        ],
        verified: false,
      };
    }

    await User.update({ id: user.id, verified: false }, { verified: true });

    return {
      verified: true,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UserLoginInput,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    console.log('LOGIN MUTATION');

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
        errors: [{ field: 'login', message: 'Incorrect login details.' }],
      };
    }
    try {
      const valid = await verifyPasswordHash(user.password, options.password);
      if (!valid) {
        // password did not match
        return {
          errors: [{ field: 'login', message: 'Incorrect login details.' }],
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
  @UseMiddleware(admin)
  async deleteUser(@Arg('id', () => ID) id: string): Promise<boolean> {
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', { id })
        .returning('*')
        .execute();

      return !!result.affected && result.affected > 0;
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }
}

function createVerificationEmail(user: User, verifyUrl: string) {
  return {
    to: user.email,
    subject: 'Please verify your email address',
    text: `Copy and paste this url into your browser to verify your email address: ${verifyUrl}`,
    html: `<p>Please click the following link to verify your email address: <a href="${verifyUrl}">verfiy email address</a></p>`,
  };
}
