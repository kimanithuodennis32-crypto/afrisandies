import { Link } from "wouter";

import SiteShell from "@/components/SiteShell";
import ProductGrid from "@/components/catalog/ProductGrid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductsBySlug } from "@/data/products";
import { cn } from "@/lib/utils";

const categoryMeta: Record<string, { title: string; blurb: string; filters?: string[] }> = {
  // Bags
  bags: { title: "Bags", blurb: "Everyday bags and travel-ready pieces.", filters: ["Price", "Color"] },
  backpacks: {
    title: "Backpacks",
    blurb: "Premium carry for school, work, and city life.",
    filters: ["Price", "Color"],
  },
  "travel-bags": { title: "Travel Bags", blurb: "Duffels made to move.", filters: ["Price", "Color"] },
  "lunch-bag": { title: "Lunch Bag", blurb: "Clean, insulated, practical.", filters: ["Price"] },
  "wash-bag": { title: "Wash Bag", blurb: "Toiletry bag for travel essentials.", filters: ["Price"] },
  "kids-bags": { title: "Kids Bags", blurb: "School-ready kids backpacks.", filters: ["Price"] },
  "kiondo-sling-handbags": {
    title: "Weave Kiondo Sling Handbags",
    blurb: "Choose size and design pattern.",
    filters: ["Size", "Design pattern", "Price"],
  },
  "african-summer-wear": {
    title: "African Wear",
    blurb: "Set: hat + bag + sandals.",
    filters: ["Size", "Price"],
  },

  // Sandals
  sandals: {
    title: "Sandals",
    blurb: "Handcrafted comfort with cultural detailing.",
    filters: ["Men/Ladies/Kids", "Size", "Color", "Price"],
  },
  "sandals-men": {
    title: "Sandals (Men)",
    blurb: "Handcrafted comfort with cultural detailing.",
    filters: ["Men/Ladies/Kids", "Size", "Color", "Price"],
  },
  "sandals-ladies": {
    title: "Sandals (Ladies)",
    blurb: "Elegant everyday sandals.",
    filters: ["Men/Ladies/Kids", "Size", "Color", "Price"],
  },
  "sandals-kids": {
    title: "Sandals (Kids)",
    blurb: "Comfort-first for active days.",
    filters: ["Men/Ladies/Kids", "Price"],
  },

  // Hoodies
  hoodies: { title: "Hoodies", blurb: "Minimal premium hoodies.", filters: ["Price", "Color"] },
};

export default function Category({ slug }: { slug: string }) {
  const meta = categoryMeta[slug] ?? {
    title: "Shop",
    blurb: "Browse products",
    filters: ["Price", "Color", "Size"],
  };

  const items = getProductsBySlug(slug);

  const showSandalsFilter = slug === "sandals" || slug.startsWith("sandals-");
  const sandalTabs = [
    { label: "All", slug: "sandals" },
    { label: "Men", slug: "sandals-men" },
    { label: "Ladies", slug: "sandals-ladies" },
    { label: "Kids", slug: "sandals-kids" },
  ];

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Category</div>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{meta.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{meta.blurb}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/shop">Back to shop</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/cart">Cart</Link>
            </Button>
          </div>
        </div>

        {/* Sandals quick filter */}
        {showSandalsFilter && (
          <div className="mt-8">
            <Card className="border-border/60 p-4">
              <div className="text-sm font-semibold">Filter: Men / Ladies / Kids</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Tap a group to find the right sizes faster.
              </p>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {sandalTabs.map((t) => {
                  const active = slug === t.slug;
                  return (
                    <Button
                      key={t.slug}
                      asChild
                      size="sm"
                      variant={active ? "default" : "outline"}
                      className={cn("rounded-full", !active && "bg-transparent")}
                    >
                      <Link href={`/category/${t.slug}`}>{t.label}</Link>
                    </Button>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Size guide (sandals) */}
        {showSandalsFilter && (
          <div className="mt-4">
            <Card className="border-border/60 p-5">
              <div className="text-sm font-semibold">Sandals size guide (quick)</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Use the tabs above to pick Men/Ladies/Kids, then choose your size.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="text-xs text-muted-foreground">Men</div>
                  <div className="mt-1 text-sm">
                    If you wear men’s shoes, start with your usual EU size (37–42 on this site).
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="text-xs text-muted-foreground">Ladies</div>
                  <div className="mt-1 text-sm">
                    Use your usual EU size. If you’re between sizes, go one size up for comfort.
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="text-xs text-muted-foreground">Kids</div>
                  <div className="mt-1 text-sm">
                    For kids, share the child’s age/foot length on WhatsApp — we’ll recommend the best fit.
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="text-xs text-muted-foreground">Fast tip</div>
                  <div className="mt-1 text-sm">
                    Measure heel-to-toe in cm, then send it with your Order ID on WhatsApp for confirmation.
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Need help? WhatsApp/Call 0736836343 with: “Men/Ladies/Kids + EU size + foot length (cm)”. 
              </p>
            </Card>
          </div>
        )}

        {/* Filters */}
        {(meta.filters ?? []).length > 0 && (
          <Card className="mt-8 border-border/60 p-5">
            <div className="text-sm font-semibold">Tips</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Production time is 4–7 working days. Pickup is available at Dynamic Mall, Tom Mboya Street, 3rd floor,
              Shop ML116. Delivery is available countrywide at a fee (confirmed on WhatsApp).
            </p>
          </Card>
        )}

        <div className="mt-10">
          <ProductGrid products={items} />
        </div>
      </section>
    </SiteShell>
  );
}
