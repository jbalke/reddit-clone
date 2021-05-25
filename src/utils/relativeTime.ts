export const relativeTime = (dt: Date | string): string => {
  const ONE_MINUTE = 1000 * 60;
  const ONE_HOUR = ONE_MINUTE * 60;
  const ONE_DAY = ONE_HOUR * 24;

  let parsedDate;
  if (typeof dt === 'string') {
    parsedDate = new Date(dt);
  } else {
    parsedDate = dt;
  }

  const diff = Date.now() - parsedDate.getTime();
  const relative = new Intl.RelativeTimeFormat('en', { style: 'long' });

  if (diff < ONE_HOUR) {
    return relative.format(Math.floor(-diff / ONE_MINUTE), 'minute');
  } else if (diff >= ONE_HOUR && diff < ONE_DAY) {
    return relative.format(Math.floor(-diff / ONE_HOUR), 'hour');
  }

  return relative.format(Math.floor(-diff / ONE_DAY), 'day');
};
