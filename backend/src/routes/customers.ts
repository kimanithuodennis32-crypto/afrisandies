import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signCustomerToken } from "../lib/auth";
import { requireCustomer } from "../middleware/requireCustomer";

export const customersRouter = Router();

// Compared against when the email doesn't exist, so "unknown email" and
// "wrong password" take the same time and give the same answer.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().min(8).max(20),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(72),
});

function publicCustomer(c: { id: string; name: string; email: string; phone: string }) {
  return { id: c.id, name: c.name, email: c.email, phone: c.phone };
}

// POST /api/customers/register
customersRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return res.status(400).json({ error: first?.message && first.message !== "Invalid" ? `${first.path.join(".")}: ${first.message}` : "Please check your details" });
  }
  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists. Try logging in." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  let customer;
  try {
    customer = await prisma.customer.create({ data: { name, email, phone, passwordHash } });
  } catch (err) {
    // two sign-ups with the same email at the same moment
    if ((err as { code?: string }).code === "P2002") {
      return res.status(409).json({ error: "An account with this email already exists. Try logging in." });
    }
    throw err;
  }

  const token = signCustomerToken({ sub: customer.id, email: customer.email });
  res.status(201).json({ token, customer: publicCustomer(customer) });
});

// POST /api/customers/login
customersRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const { email, password } = parsed.data;

  const customer = await prisma.customer.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, customer?.passwordHash ?? DUMMY_HASH);
  if (!customer || !valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signCustomerToken({ sub: customer.id, email: customer.email });
  res.json({ token, customer: publicCustomer(customer) });
});

// GET /api/customers/me
customersRouter.get("/me", requireCustomer, async (req, res) => {
  const customer = await prisma.customer.findUnique({ where: { id: req.customer!.id } });
  if (!customer) return res.status(401).json({ error: "Account not found. Please log in again." });
  res.json(publicCustomer(customer));
});

// GET /api/customers/orders  — only the logged-in customer's own orders
customersRouter.get("/orders", requireCustomer, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { customerId: req.customer!.id },
    include: { lines: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json(
    orders.map((o) => ({
      id: o.id,
      orderCode: o.orderCode,
      status: o.status,
      deliveryMethod: o.deliveryMethod,
      subtotalKes: o.subtotalKes,
      shippingKes: o.shippingKes,
      totalKes: o.totalKes,
      createdAt: o.createdAt,
      lines: o.lines.map((l) => ({
        id: l.id,
        productTitle: l.productTitle,
        unitPriceKes: l.unitPriceKes,
        qty: l.qty,
        size: l.size,
        color: l.color,
        pattern: l.pattern,
      })),
    }))
  );
});
