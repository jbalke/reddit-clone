import { FormikErrors } from 'formik';
import { __emailRE__ } from '../constants';
import { PostReplyInput } from '../generated/graphql';

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

interface ForgotPasswordInput {
  email: string;
}

export const validateEmailInput = ({ email }: ForgotPasswordInput) => {
  const errors: FormikErrors<ForgotPasswordInput> = {};

  validateEmail(email, errors);
  return errors;
};

interface PostInput {
  title: string;
  text: string;
  parentId: string;
}

export const validatePostInput = ({ title, text, parentId }: PostInput) => {
  const errors: FormikErrors<PostInput> = {};

  if (!parentId) {
    validateTitle(title, errors);
  }

  validateText(text, errors);

  return errors;
};

export const validatePostReplyInput = ({ parentId, text }: PostReplyInput) => {
  const errors: FormikErrors<PostReplyInput> = {};

  validateText(text, errors);

  return errors;
};

function validateTitle(title: string, errors: any) {
  if (!title) {
    errors.title = 'Required';
  } else if (title.trim().length < 6) {
    errors.title = 'Title length must be 6 or greater';
  }
}

function validateText(text: string, errors: any) {
  if (!text) {
    errors.text = 'Required';
  } else if (text.trim().length === 0) {
    errors.text = 'Text cannot be an empty string';
  }
}

function validateEmailOrUsername(emailOrUsername: string, errors: any) {
  if (!emailOrUsername) {
    errors.emailOrUsername = 'Required';
  } else if (!__emailRE__.test(emailOrUsername)) {
    const error = validateUsername(emailOrUsername);
    if (error) errors.emailOrUsername = error;
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

function validateUsername(username: string, errors?: any) {
  let errorMsg: string | null = null;

  if (!username) {
    errorMsg = 'Required';
  } else if (username.length < 3) {
    errorMsg = 'Must be 3 characters or more';
  } else if (
    username.split('').some((c) => __invalidCharacters__.includes(c))
  ) {
    errorMsg = __invalidCharactersMessage__;
  }

  if (typeof errors === 'object' && errorMsg) {
    errors.username = errorMsg;
  }

  return errorMsg;
}
