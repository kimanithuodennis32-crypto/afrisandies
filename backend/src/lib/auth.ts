import jwt from "jsonwebtoken";

const secretFromEnv = process.env.JWT_SECRET;
if (!secretFromEnv) {
  throw new Error("JWT_SECRET is not set. Copy .env.example to .env and set a real secret.");
}
const JWT_SECRET: string = secretFromEnv;

export type TokenRole = "admin" | "customer";

export interface TokenPayload {
  sub: string; // user id
  email: string;
  role: TokenRole;
}
export type AdminTokenPayload = TokenPayload;

type Identity = { sub: string; email: string };

export function signAdminToken(identity: Identity) {
  return jwt.sign({ ...identity, role: "admin" satisfies TokenRole }, JWT_SECRET, { expiresIn: "12h" });
}

export function signCustomerToken(identity: Identity) {
  return jwt.sign({ ...identity, role: "customer" satisfies TokenRole }, JWT_SECRET, { expiresIn: "30d" });
}

function verifyWithRole(token: string, role: TokenRole): TokenPayload {
  const payload = jwt.verify(token, JWT_SECRET) as Partial<TokenPayload>;
  // Both kinds of token share one secret, so the role MUST be checked:
  // otherwise a customer's token would be accepted by the admin routes.
  if (payload.role !== role || !payload.sub || !payload.email) {
    throw new Error("Wrong token type");
  }
  return payload as TokenPayload;
}

export const verifyAdminToken = (token: string) => verifyWithRole(token, "admin");
export const verifyCustomerToken = (token: string) => verifyWithRole(token, "customer");
