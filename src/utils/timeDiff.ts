type dateInput = Date | string;

function parseDate(dt: dateInput): Date {
  let parsed;
  if (typeof dt === 'string') {
    return new Date(dt);
  }
  return dt;
}
export const timeDiffInSeconds = (a: dateInput, b: dateInput) => {
  let parsedA, parsedB;
  parsedA = parseDate(a);
  parsedB = parseDate(b);

  return Math.abs(parsedA.getTime() - parsedB.getTime()) / 1000;
};
