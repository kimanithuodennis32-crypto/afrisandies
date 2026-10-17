import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product, ProductColor, ProductSize } from "@/data/types";

export interface CartLine {
  productId: string;
  title: string;
  unitPriceKes: number;
  imageSrc: string;
  size?: ProductSize;
  color?: ProductColor;
  pattern?: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  addToCart: (args: {
    product: Product;
    qty: number;
    size?: ProductSize;
    color?: ProductColor;
    pattern?: string;
  }) => void;
  updateQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clear: () => void;
  subtotalKes: number;
}

const CartContext = createContext<CartState | null>(null);

function getUnitPriceKes(product: Product, size?: ProductSize) {
  if (product.sizePricing && size != null) {
    const p = product.sizePricing[String(size)];
    if (typeof p === "number") return p;
  }
  return product.priceKes;
}

function getPatternImageSrc(product: Product, pattern?: string) {
  if (!product.patterns || product.patterns.length === 0) return product.images[0]?.src ?? "";
  const match = pattern ? product.patterns.find((p) => p.label === pattern) : null;
  return (match ?? product.patterns[0])?.images?.[0]?.src ?? product.images[0]?.src ?? "";
}

function lineKey(line: Pick<CartLine, "productId" | "size" | "color" | "pattern">) {
  return `${line.productId}::${line.size ?? "na"}::${line.color ?? "na"}::${line.pattern ?? "na"}`;
}

const STORAGE_KEY = "afri-sandies.cart.v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines]);

  const subtotalKes = useMemo(
    () => lines.reduce((sum, l) => sum + l.unitPriceKes * l.qty, 0),
    [lines]
  );

  const api: CartState = {
    lines,
    subtotalKes,
    addToCart: ({ product, qty, size, color, pattern }) => {
      const key = lineKey({ productId: product.id, size, color, pattern });
      setLines((prev) => {
        const idx = prev.findIndex((l) => lineKey(l) === key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        const imageSrc = getPatternImageSrc(product, pattern);
        const unitPriceKes = getUnitPriceKes(product, size);
        return [
          ...prev,
          {
            productId: product.id,
            title: product.title,
            unitPriceKes,
            imageSrc,
            size,
            color,
            pattern,
            qty,
          },
        ];
      });
      toast.success("Added to cart");
    },
    updateQty: (key, qty) => {
      setLines((prev) =>
        prev
          .map((l) => (lineKey(l) === key ? { ...l, qty: Math.max(1, qty) } : l))
          .filter((l) => l.qty > 0)
      );
    },
    removeLine: (key) => {
      setLines((prev) => prev.filter((l) => lineKey(l) !== key));
      toast.message("Removed from cart");
    },
    clear: () => {
      setLines([]);
      toast.message("Cart cleared");
    },
  };

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function getLineKey(line: Pick<CartLine, "productId" | "size" | "color">) {
  return lineKey(line);
}
