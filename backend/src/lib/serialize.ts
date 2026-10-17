import type { Product as ProductRow } from "@prisma/client";

// Matches src/data/types.ts on the frontend, so /api/products can drop
// straight in as a replacement for the static products.ts array.
export function serializeProduct(p: ProductRow) {
  return {
    id: p.id,
    title: p.title,
    priceKes: p.priceKes,
    rating: p.rating,
    category: p.category,
    subcategory: p.subcategory ?? undefined,
    stock: p.stock,
    images: JSON.parse(p.images) as { src: string; alt: string }[],
    colors: JSON.parse(p.colors) as string[],
    sizes: JSON.parse(p.sizes) as (number | string)[],
    sizePricing: p.sizePricing ? (JSON.parse(p.sizePricing) as Record<string, number>) : undefined,
    patterns: p.patterns
      ? (JSON.parse(p.patterns) as { id: string; label: string; images: { src: string; alt: string }[] }[])
      : undefined,
    description: p.description,
    materials: p.materials,
    shipping: p.shipping,
  };
}
