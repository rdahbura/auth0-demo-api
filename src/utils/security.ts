import bcrypt from 'bcryptjs';

import { SALT_ROUNDS } from './constants';

async function compare(clear: string, hash: string): Promise<boolean> {
  const isEqual = await bcrypt.compare(clear, hash);

  return isEqual;
}

async function hash(clear: string): Promise<string> {
  const hash = await bcrypt.hash(clear, SALT_ROUNDS);

  return hash;
}

export { compare, hash };
