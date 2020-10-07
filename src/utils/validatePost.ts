import { object, string, ValidationError } from 'yup';
import { PostInput, PostReplyInput, UpdatePostInput } from '../resolvers/post';
import { FieldError } from '../resolvers/types';

let postSchema = object().shape({
  title: string().required().trim().max(256).min(6),
  text: string().required().trim().max(2048).min(1),
});

export const validatePost = (input: PostInput): FieldError[] => {
  const errors: FieldError[] = [];
  try {
    postSchema.validateSync(input);
  } catch (error) {
    const { path, message } = error as ValidationError;
    errors.push({ field: path, message });
  }
  return errors;
};

let updatePostSchema = object().shape({
  text: string().required().trim().max(2048).min(1),
});

export const validateUpdatePost = (input: UpdatePostInput): FieldError[] => {
  const errors: FieldError[] = [];
  try {
    updatePostSchema.validateSync(input);
  } catch (error) {
    const { path, message } = error as ValidationError;
    errors.push({ field: path, message });
  }
  return errors;
};

let replySchema = object().shape({
  text: string().required().trim().max(2048).min(1),
});

export const validateReply = (input: PostReplyInput): FieldError[] => {
  const errors: FieldError[] = [];
  try {
    replySchema.validateSync(input);
  } catch (error) {
    const { path, message } = error as ValidationError;
    errors.push({ field: path, message });
  }
  return errors;
};
