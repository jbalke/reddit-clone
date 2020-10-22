export const formatTimeStamp = (dt: Date | string): string => {
  let date: Date;
  if (typeof dt === 'string') {
    date = new Date(dt);
  } else {
    date = dt;
  }
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
