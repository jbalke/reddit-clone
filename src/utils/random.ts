import { promisify } from 'util';
import crypto from 'crypto';

const randomBytes = promisify(crypto.randomBytes);

export async function genRandomString(length: number): Promise<string> {
  return (await randomBytes(length)).toString('base64');
}
