import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

export function signAccessToken(payload: object): string {
  const secret: Secret = process.env.JWT_ACCESS_SECRET ?? "";
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "24h",
  } as SignOptions;

  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken<T>(token: string): T {
  const secret: Secret = process.env.JWT_ACCESS_SECRET ?? "";
  return jwt.verify(token, secret) as T;
}
