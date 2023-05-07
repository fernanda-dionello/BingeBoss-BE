import crypto from 'crypto';

export const generateCrypto = (pwd: string): string => {
  const encryptPassword = crypto.createHash('sha1');
  encryptPassword.update(pwd);
  return encryptPassword.digest('hex');
}