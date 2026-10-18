import type { NextFunction, Request, Response } from "express";
import { verifyCustomerToken } from "../lib/auth";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      customer?: { id: string; email: string };
    }
  }
}

export function requireCustomer(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Please log in to continue" });
  }
  try {
    const payload = verifyCustomerToken(header.slice("Bearer ".length));
    req.customer = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Your session has expired. Please log in again." });
  }
}

/** For routes that work for guests too: returns the customer id if a valid customer token is sent. */
export function optionalCustomerId(authorization: string | undefined): string | undefined {
  if (!authorization?.startsWith("Bearer ")) return undefined;
  try {
    return verifyCustomerToken(authorization.slice("Bearer ".length)).sub;
  } catch {
    return undefined; // bad/expired token: treat as a guest rather than blocking the order
  }
}
