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

export const formatTimeStampFull = (dt: Date | string): string => {
  let date: Date;
  if (typeof dt === 'string') {
    date = new Date(dt);
  } else {
    date = dt;
  }
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }).format(date);
};
