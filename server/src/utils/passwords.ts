import argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function verifyPasswordHash(hash: string, password: string) {
  return argon2.verify(hash, password);
}
