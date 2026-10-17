export type ProductCategory = "sandals" | "bags" | "hoodies";

export type ProductColor = string;
export type ProductSize = number | string;

export interface ProductPattern {
  id: string;
  label: string;
  images: { src: string; alt: string }[];
}

export interface Product {
  id: string;
  title: string;
  /** Base price. If sizePricing exists, selected size overrides this. */
  priceKes: number;
  rating: number;
  /** Top-level grouping used for navigation */
  category: ProductCategory;
  /** Optional subcategory used for finer filtering (e.g., Men / Ladies / Kids, Backpacks) */
  subcategory?: string;
  images: { src: string; alt: string }[];
  colors: ProductColor[];
  /** Use [1] for one-size / ask-on-WhatsApp items */
  sizes: ProductSize[];
  /** Optional: price varies by selected size label */
  sizePricing?: Record<string, number>;
  /** Optional: design/pattern variants (used for Kiondo) */
  patterns?: ProductPattern[];

  description: string;
  materials: string;
  shipping: string;
}
