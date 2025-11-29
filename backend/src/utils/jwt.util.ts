import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export function generateAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
