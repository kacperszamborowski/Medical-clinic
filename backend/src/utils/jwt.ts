import jwt from "jsonwebtoken";

export function signAccessToken(payload: object) {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );
}

export function verifyAccessToken<T>(token: string): T {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  ) as T;
}
