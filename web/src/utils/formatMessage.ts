export const formatMessage = (message: string) => {
  const { length, [length - 1]: last } = message;

  let result = message.charAt(0).toUpperCase() + message.slice(1);

  if (last !== '.') {
    result += '.';
  }

  return result;
};
