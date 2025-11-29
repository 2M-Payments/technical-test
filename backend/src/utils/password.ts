import bcrypt from "bcryptjs";

const HASH_ROUNDS = 10;

export async function hashPassword(rawPassword: string) {
  return await bcrypt.hash(rawPassword, HASH_ROUNDS);
}

export async function comparePassword(rawPassword: string, hashedPassword: string) {
  return await bcrypt.compare(rawPassword, hashedPassword);
}


