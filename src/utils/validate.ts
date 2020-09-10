import { FormikErrors } from 'formik';
import { __emailRE__ } from '../constants';

const __invalidCharacters__ = ['@', ' ', '!', '_', '-'];
const __invalidCharactersMessage__ = `Username can not contain the following: "${__invalidCharacters__
  .filter((c) => c !== ' ')
  .join(' ')}" and spaces`;

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export const validateRegisterInput = ({
  username,
  email,
  password,
}: RegisterInput) => {
  const errors: FormikErrors<RegisterInput> = {};

  validateUsername(username, errors);
  validateEmail(email, errors);
  validatePassword(password, errors);

  return errors;
};

interface LoginInput {
  emailOrUsername: string;
  password: string;
}

export const validateLoginInput = ({
  emailOrUsername,
  password,
}: LoginInput) => {
  const errors: FormikErrors<LoginInput> = {};

  validateEmailOrUsername(emailOrUsername, errors);
  validatePassword(password, errors);

  return errors;
};

interface PasswordResetInput {
  password: string;
}

export const validatePasswordInput = ({ password }: PasswordResetInput) => {
  const errors: FormikErrors<PasswordResetInput> = {};

  validatePassword(password, errors);
  return errors;
};

function validateEmailOrUsername(emailOrUsername: string, errors: any) {
  if (!emailOrUsername) {
    errors.emailOrUsername = 'Required';
  } else if (!__emailRE__.test(emailOrUsername)) {
    if (emailOrUsername.length < 3) {
      errors.emailOrUsername = 'Username must be 3 characters or more';
    } else if (
      emailOrUsername.split('').some((c) => __invalidCharacters__.includes(c))
    ) {
      errors.emailOrUsername = __invalidCharactersMessage__;
    }
  }
}

function validatePassword(password: string, errors: any) {
  if (!password) {
    errors.password = 'Required';
  } else if (password.length <= 6) {
    errors.password = 'Password length must be greater than 6';
  }
}

function validateEmail(email: string, errors: any) {
  if (!email) {
    errors.email = 'Required';
  } else if (!__emailRE__.test(email)) {
    errors.email = 'Invalid email address';
  }
}

function validateUsername(username: string, errors: any) {
  if (!username) {
    errors.username = 'Required';
  } else if (username.length < 3) {
    errors.username = 'Must be 3 characters or more';
  } else if (
    username.split('').some((c) => __invalidCharacters__.includes(c))
  ) {
    errors.username = __invalidCharactersMessage__;
  }
}
