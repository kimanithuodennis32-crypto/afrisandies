import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/requireAdmin";

export const adminRouter = Router();

// GET /api/admin/stats  (admin only) — real numbers for the Admin.tsx dashboard cards
adminRouter.get("/stats", requireAdmin, async (_req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [salesAgg, ordersToday, productsCount, distinctCustomers] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalKes: true },
      where: { status: { not: "cancelled" } },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.product.count({ where: { active: true } }),
    prisma.order.findMany({
      distinct: ["customerPhone"],
      select: { customerPhone: true },
    }),
  ]);

  res.json({
    totalSalesKes: salesAgg._sum.totalKes ?? 0,
    ordersToday,
    productsCount,
    customersCount: distinctCustomers.length,
  });
});
