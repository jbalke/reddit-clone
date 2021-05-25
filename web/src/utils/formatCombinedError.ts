import { CombinedError } from 'urql';

export const formatCombinedError = (e: CombinedError) => {
  return e.message.replace(/^\[(GraphQL|Network)\]\s/, '');
};
