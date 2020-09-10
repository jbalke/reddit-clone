import { __emailRE__ } from '../constants';
import { Credentials, FieldError } from './user';

export function validateCredentials({
  email,
  username,
  password,
}: Partial<Credentials>): FieldError[] {
  const errors: FieldError[] = [];
  const invalidCharacters = ['@', ' ', '!', '_', '-'];

  if (email && !__emailRE__.test(email)) {
    errors.push({
      field: 'email',
      message: 'does not appear to be a valid email address',
    });
  }

  if (
    username &&
    username.split('').some((c) => invalidCharacters.includes(c))
  ) {
    errors.push({
      field: 'username',
      message: `username can not contain the following: ${invalidCharacters.join(
        ''
      )}`,
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
