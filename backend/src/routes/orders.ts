import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/requireAdmin";
import { STORE_CONFIG } from "../lib/storeConfig";

export const ordersRouter = Router();

const orderLineInput = z.object({
  productId: z.string().min(1),
  qty: z.number().int().positive(),
  size: z.union([z.string(), z.number()]).optional(),
  color: z.string().optional(),
  pattern: z.string().optional(),
});

const createOrderSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  county: z.string().optional(),
  town: z.string().optional(),
  address: z.string().optional(),
  delivery: z.enum(["home", "pickup"]),
  lines: z.array(orderLineInput).min(1),
});

function formatKes(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

async function generateUniqueOrderCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = `AF${Math.floor(10000 + Math.random() * 90000)}`;
    const clash = await prisma.order.findUnique({ where: { orderCode: code } });
    if (!clash) return code;
  }
  // astronomically unlikely fallback
  return `AF${Date.now().toString().slice(-6)}`;
}

function buildWhatsAppMessage(args: {
  orderCode: string;
  name: string;
  phone: string;
  county?: string;
  town?: string;
  address?: string;
  delivery: "home" | "pickup";
  lines: { title: string; qty: number; unitPriceKes: number; size?: string | number; color?: string; pattern?: string; hasSandalId: boolean }[];
  subtotalKes: number;
  shippingKes: number;
  totalKes: number;
}) {
  const hasSandals = args.lines.some((l) => l.hasSandalId);

  const itemsText = args.lines
    .map((l) => {
      const meta = [
        l.size !== undefined ? `Size ${l.size}` : "",
        l.color ? `Color ${l.color}` : "",
        l.pattern ? `Pattern ${l.pattern}` : "",
      ]
        .filter(Boolean)
        .join(" • ");
      return `- ${l.qty} x ${l.title}${meta ? ` (${meta})` : ""} = ${formatKes(l.qty * l.unitPriceKes)}`;
    })
    .join("\n");

  return [
    `Hi AFRI SANDIES, I want to place an order.`,
    ``,
    `Order ID: ${args.orderCode}`,
    `Name: ${args.name}`,
    `Phone: ${args.phone}`,
    args.county ? `County: ${args.county}` : null,
    args.town ? `Town: ${args.town}` : null,
    args.address ? `Address: ${args.address}` : null,
    `Delivery: ${args.delivery === "home" ? "Home delivery" : "Pickup"}`,
    ``,
    `Items:`,
    itemsText,
    ``,
    `Subtotal: ${formatKes(args.subtotalKes)}`,
    `Shipping: ${formatKes(args.shippingKes)}`,
    `Total: ${formatKes(args.totalKes)}`,
    ``,
    `Production time: ${STORE_CONFIG.productionDays}`,
    `Pickup point: ${STORE_CONFIG.pickupPoint}`,
    `Delivery: Countrywide delivery available at a fee (confirmed on WhatsApp).`,
    hasSandals ? `Sandals: 50% deposit required before production.` : null,
    ``,
    `Payment (M-Pesa Paybill):`,
    `Paybill: ${STORE_CONFIG.mpesaPaybill}`,
    `Paybill Account: ${STORE_CONFIG.mpesaAccount}`,
    `After paying, reply here with the M-Pesa code + Order ID (${args.orderCode}).`,
    `WhatsApp/Call: ${STORE_CONFIG.contactPrimary}`,
  ]
    .filter(Boolean)
    .join("\n");
}

// POST /api/orders — public. Recomputes prices server-side; never trusts client-sent prices.
ordersRouter.post("/", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid order payload", details: parsed.error.flatten() });
  }
  const input = parsed.data;

  const productIds = [...new Set(input.lines.map((l) => l.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productById = new Map(products.map((p) => [p.id, p]));

  const resolvedLines: {
    productId: string;
    title: string;
    unitPriceKes: number;
    qty: number;
    size?: string;
    color?: string;
    pattern?: string;
  }[] = [];

  for (const line of input.lines) {
    const product = productById.get(line.productId);
    if (!product || !product.active) {
      return res.status(400).json({ error: `Product "${line.productId}" is not available` });
    }
    if (product.stock < line.qty) {
      return res.status(409).json({ error: `Not enough stock for "${product.title}" (have ${product.stock}, wanted ${line.qty})` });
    }

    let unitPriceKes = product.priceKes;
    if (product.sizePricing && line.size !== undefined) {
      const pricing = JSON.parse(product.sizePricing) as Record<string, number>;
      const match = pricing[String(line.size)];
      if (typeof match === "number") unitPriceKes = match;
    }

    resolvedLines.push({
      productId: product.id,
      title: product.title,
      unitPriceKes,
      qty: line.qty,
      size: line.size !== undefined ? String(line.size) : undefined,
      color: line.color,
      pattern: line.pattern,
    });
  }

  const subtotalKes = resolvedLines.reduce((sum, l) => sum + l.unitPriceKes * l.qty, 0);
  const shippingKes = input.delivery === "home" ? STORE_CONFIG.shippingKes : 0;
  const totalKes = subtotalKes + shippingKes;
  const orderCode = await generateUniqueOrderCode();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderCode,
        customerName: input.name,
        customerPhone: input.phone,
        county: input.county,
        town: input.town,
        address: input.address,
        deliveryMethod: input.delivery,
        subtotalKes,
        shippingKes,
        totalKes,
        lines: {
          create: resolvedLines.map((l) => ({
            productId: l.productId,
            productTitle: l.title,
            unitPriceKes: l.unitPriceKes,
            qty: l.qty,
            size: l.size,
            color: l.color,
            pattern: l.pattern,
          })),
        },
      },
      include: { lines: true },
    });

    for (const l of resolvedLines) {
      await tx.product.update({
        where: { id: l.productId },
        data: { stock: { decrement: l.qty } },
      });
    }

    return created;
  });

  const message = buildWhatsAppMessage({
    orderCode: order.orderCode,
    name: order.customerName,
    phone: order.customerPhone,
    county: order.county ?? undefined,
    town: order.town ?? undefined,
    address: order.address ?? undefined,
    delivery: order.deliveryMethod as "home" | "pickup",
    lines: resolvedLines.map((l) => ({ ...l, hasSandalId: l.productId.startsWith("sandals") })),
    subtotalKes: order.subtotalKes,
    shippingKes: order.shippingKes,
    totalKes: order.totalKes,
  });
  const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsappE164}?text=${encodeURIComponent(message)}`;

  res.status(201).json({ order, whatsappUrl });
});

// GET /api/orders?status=pending&q=AF12345&limit=20&offset=0  (admin only)
ordersRouter.get("/", requireAdmin, async (req, res) => {
  const { status, q } = req.query;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;

  const where = {
    ...(typeof status === "string" ? { status } : {}),
    ...(typeof q === "string" && q.trim()
      ? {
          OR: [
            { orderCode: { contains: q.trim() } },
            { customerPhone: { contains: q.trim() } },
            { customerName: { contains: q.trim() } },
          ],
        }
      : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { lines: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ orders, total, limit, offset });
});

// GET /api/orders/:id  (admin only)
ordersRouter.get("/:id", requireAdmin, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { lines: true },
  });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

const updateOrderSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "completed", "cancelled"]).optional(),
  mpesaCode: z.string().optional(),
});

// PATCH /api/orders/:id  (admin only) — e.g. confirm payment / advance fulfilment status
ordersRouter.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = updateOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid update payload", details: parsed.error.flatten() });
  }

  const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Order not found" });

  const updated = await prisma.order.update({
    where: { id: req.params.id },
    data: parsed.data,
    include: { lines: true },
  });

  res.json(updated);
});
