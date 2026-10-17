import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import type { Product } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/store/cart";

function formatKes(v: number) {
  return `KES ${v.toLocaleString("en-KE")}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 240, damping: 18 }}>
      <Card className="overflow-hidden border-border/60 bg-card">
        <Link href={`/product/${product.id}`} className="block">
          <div className="aspect-square w-full bg-muted">
            <img
              src={product.images[0]?.src}
              alt={product.images[0]?.alt ?? product.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Link>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link href={`/product/${product.id}`} className="font-semibold leading-snug hover:underline">
                {product.title}
              </Link>
              <div className="mt-1 text-sm text-muted-foreground">{formatKes(product.priceKes)}</div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              className="w-full rounded-full"
              onClick={() => addToCart({ product, qty: 1 })}
            >
              Add to Cart
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/product/${product.id}`}>View</Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
