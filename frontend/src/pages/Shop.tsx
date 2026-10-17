import { Link } from "wouter";

import SiteShell from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/catalog/ProductGrid";
import { products } from "@/data/products";

const categories = [
  { title: "Bags", slug: "bags", blurb: "Everyday bags and travel-ready pieces." },
  { title: "Kids Bags", slug: "kids-bags", blurb: "School-ready kids backpacks (KES 1,700)." },
  { title: "Backpacks", slug: "backpacks", blurb: "Premium carry for school, work, and city life." },
  { title: "Weave Kiondo Sling Handbags", slug: "kiondo-sling-handbags", blurb: "Pick size + design pattern." },
  { title: "African Wear", slug: "african-summer-wear", blurb: "Set: hat + bag + sandals." },
  { title: "Travel Bags", slug: "travel-bags", blurb: "Duffels made to move." },
  { title: "Lunch Bag", slug: "lunch-bag", blurb: "Clean, insulated, practical." },
  { title: "Wash Bag", slug: "wash-bag", blurb: "Toiletry bag for travel essentials." },
  { title: "Sandals (Men)", slug: "sandals-men", blurb: "Handcrafted comfort with cultural detailing." },
  { title: "Sandals (Ladies)", slug: "sandals-ladies", blurb: "Elegant everyday sandals." },
  { title: "Sandals (Kids)", slug: "sandals-kids", blurb: "Comfort-first for active days." },
  { title: "Hoodies", slug: "hoodies", blurb: "Minimal premium hoodies." },
];

export default function Shop() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Shop</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Premium, African, elegant — built mobile-first for TikTok, IG, FB and WhatsApp traffic.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Quick view</Badge>
            <Badge variant="secondary">Size + color</Badge>
            <Badge variant="secondary">Cart + WhatsApp checkout</Badge>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {categories.map((c) => (
            <Card key={c.slug} className="p-5 border-border/60">
              <div className="text-sm text-muted-foreground">Category</div>
              <div className="mt-1 text-xl font-bold">{c.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{c.blurb}</p>
              <Button asChild variant="outline" className="mt-4 rounded-full">
                <Link href={`/category/${c.slug}`}>Browse</Link>
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">All Products</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a simple catalog — checkout sends the full order to WhatsApp.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/cart">Go to Cart</Link>
          </Button>
        </div>

        <div className="mt-6">
          <ProductGrid products={products} />
        </div>
      </section>
    </SiteShell>
  );
}
