import bcrypt from "bcryptjs";

const HASH_ROUNDS = 10;

export async function hashPassword(rawPassword: string): Promise<string> {
  return bcrypt.hash(rawPassword, HASH_ROUNDS);
}

export async function comparePassword(rawPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(rawPassword, hashedPassword);
}

