import { createHash } from 'crypto';

export const createSha256Hash = (value: string): string => {
  const hash = createHash('sha256');
  const hashString = hash.update(value).digest().toString('hex');
  return hashString;
};
