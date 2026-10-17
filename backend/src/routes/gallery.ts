import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/requireAdmin";

export const galleryRouter = Router();

const CATEGORIES = ["event", "customer", "other"] as const;

// GET /api/gallery?category=event  (public) — newest first
galleryRouter.get("/", async (req, res) => {
  const { category } = req.query;
  const filter =
    typeof category === "string" && (CATEGORIES as readonly string[]).includes(category)
      ? { category }
      : undefined;

  const items = await prisma.galleryItem.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  res.json(items);
});

const createSchema = z.object({
  imageUrl: z.string().url().max(2000),
  caption: z.string().max(300).default(""),
  category: z.enum(CATEGORIES).default("event"),
});

// POST /api/gallery  (admin)
galleryRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid gallery item", details: parsed.error.flatten() });
  }
  const item = await prisma.galleryItem.create({ data: parsed.data });
  res.status(201).json(item);
});

const updateSchema = z.object({
  caption: z.string().max(300).optional(),
  category: z.enum(CATEGORIES).optional(),
});

// PATCH /api/gallery/:id  (admin) — edit caption / category
galleryRouter.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid update" });
  const existing = await prisma.galleryItem.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Gallery item not found" });
  const item = await prisma.galleryItem.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(item);
});

// DELETE /api/gallery/:id  (admin)
galleryRouter.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.galleryItem.deleteMany({ where: { id: req.params.id } });
  res.status(204).end();
});
