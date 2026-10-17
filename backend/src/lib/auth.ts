import jwt from "jsonwebtoken";

const secretFromEnv = process.env.JWT_SECRET;
if (!secretFromEnv) {
  throw new Error("JWT_SECRET is not set. Copy .env.example to .env and set a real secret.");
}
const JWT_SECRET: string = secretFromEnv;

export interface AdminTokenPayload {
  sub: string; // admin user id
  email: string;
}

export function signAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
}
