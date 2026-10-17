import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { serializeProduct } from "../lib/serialize";
import { requireAdmin } from "../middleware/requireAdmin";

export const productsRouter = Router();

// GET /api/products?category=sandals&subcategory=Men&q=leather
productsRouter.get("/", async (req, res) => {
  const { category, subcategory, q } = req.query;

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(typeof category === "string" ? { category } : {}),
      ...(typeof subcategory === "string" ? { subcategory } : {}),
      ...(typeof q === "string" && q.trim()
        ? { title: { contains: q.trim() } }
        : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  res.json(products.map(serializeProduct));
});

// GET /api/products/:id
productsRouter.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product || !product.active) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(serializeProduct(product));
});

const imageSchema = z.object({ src: z.string().min(1), alt: z.string().min(1) });

const productWriteSchema = z.object({
  id: z.string().min(1).optional(), // required on create, ignored on update
  title: z.string().min(1),
  priceKes: z.number().int().positive(),
  rating: z.number().min(0).max(5).default(4.5),
  category: z.enum(["sandals", "bags", "hoodies"]),
  subcategory: z.string().optional(),
  stock: z.number().int().min(0).default(50),
  images: z.array(imageSchema).min(1),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.union([z.number(), z.string()])).default([]),
  sizePricing: z.record(z.number()).optional(),
  patterns: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        images: z.array(imageSchema),
      })
    )
    .optional(),
  description: z.string().min(1),
  materials: z.string().min(1),
  shipping: z.string().min(1),
});

// POST /api/products  (admin only)
productsRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = productWriteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid product payload", details: parsed.error.flatten() });
  }
  const data = parsed.data;
  if (!data.id) {
    return res.status(400).json({ error: "id is required when creating a product" });
  }

  const existing = await prisma.product.findUnique({ where: { id: data.id } });
  if (existing) {
    return res.status(409).json({ error: `Product with id "${data.id}" already exists` });
  }

  const created = await prisma.product.create({
    data: {
      id: data.id,
      title: data.title,
      priceKes: data.priceKes,
      rating: data.rating,
      category: data.category,
      subcategory: data.subcategory,
      stock: data.stock,
      images: JSON.stringify(data.images),
      colors: JSON.stringify(data.colors),
      sizes: JSON.stringify(data.sizes),
      sizePricing: data.sizePricing ? JSON.stringify(data.sizePricing) : null,
      patterns: data.patterns ? JSON.stringify(data.patterns) : null,
      description: data.description,
      materials: data.materials,
      shipping: data.shipping,
    },
  });

  res.status(201).json(serializeProduct(created));
});

// PUT /api/products/:id  (admin only)
productsRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = productWriteSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid product payload", details: parsed.error.flatten() });
  }
  const data = parsed.data;

  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updated = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.priceKes !== undefined ? { priceKes: data.priceKes } : {}),
      ...(data.rating !== undefined ? { rating: data.rating } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.subcategory !== undefined ? { subcategory: data.subcategory } : {}),
      ...(data.stock !== undefined ? { stock: data.stock } : {}),
      ...(data.images !== undefined ? { images: JSON.stringify(data.images) } : {}),
      ...(data.colors !== undefined ? { colors: JSON.stringify(data.colors) } : {}),
      ...(data.sizes !== undefined ? { sizes: JSON.stringify(data.sizes) } : {}),
      ...(data.sizePricing !== undefined ? { sizePricing: JSON.stringify(data.sizePricing) } : {}),
      ...(data.patterns !== undefined ? { patterns: JSON.stringify(data.patterns) } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.materials !== undefined ? { materials: data.materials } : {}),
      ...(data.shipping !== undefined ? { shipping: data.shipping } : {}),
    },
  });

  res.json(serializeProduct(updated));
});

// DELETE /api/products/:id  (admin only) — soft delete so past orders keep a valid reference
productsRouter.delete("/:id", requireAdmin, async (req, res) => {
  const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    return res.status(404).json({ error: "Product not found" });
  }
  await prisma.product.update({ where: { id: req.params.id }, data: { active: false } });
  res.status(204).send();
});
