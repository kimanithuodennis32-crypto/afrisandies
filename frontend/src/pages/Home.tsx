import heroImg from "@/assets/afri/hero.png";
import logoBlack from "@/assets/afri/logo/logo-dark.svg";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { AtSign, Globe, Copy } from "lucide-react";
import { toast } from "sonner";

import SiteShell from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/catalog/ProductGrid";
import { products } from "@/data/products";

export default function Home() {
  const orderTemplate =
    "Hi AFRI SANDIES, I want to place an order.\n\n" +
    "Name: ____\n" +
    "Phone: ____\n" +
    "County/Town: ____\n" +
    "Delivery address: ____\n\n" +
    "Items:\n" +
    "- 1 x (Product name) (Size __, Color __)\n\n" +
    "Delivery fee: KES 300\n" +
    "Total: KES ____\n\n" +
    "Payment: M-Pesa Paybill\n" +
    "Paybill No.: 247247\n" +
    "Account No.: 0799606933\n\n" +
    "Production time: 4–7 working days\n" +
    "Pickup point: Dynamic Mall, Tom Mboya Street, 3rd floor, Shop ML116\n" +
    "WhatsApp/Call: 0736836343\n\n" +
    "After paying, I will WhatsApp the M-Pesa code + my Order ID/name.";

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Template copied");
      return;
    } catch {
      // fall back
    }

    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success("Template copied");
    } catch {
      toast.error("Copy failed — please copy manually.");
    }
  }

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="AFRI SANDIES hero textile texture"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 grain" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2"
            >
              <Badge className="bg-accent text-accent-foreground">Premium Handmade</Badge>
              <Badge variant="secondary">Mobile-first</Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
              className="mt-6"
            >
              <img
                src={logoBlack}
                alt="AFRI SANDIES"
                className="h-40 w-auto max-w-[92vw] select-none sm:h-48 md:h-56"
                loading="eager"
              />
              <span className="sr-only">AFRI SANDIES</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.16 }}
              className="mt-5 text-xl text-white/90"
            >
              Walk African.
              <br />
              Wear Culture.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24 }}
              className="mt-5 text-sm text-white/80"
            >
              Handcrafted Sandals • Bags • Backpacks • Hoodies
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="rounded-full">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white/10">
                <Link href="/contact">WhatsApp Order</Link>
              </Button>
            </motion.div>
          </div>

          <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
            {[
              { label: "Bags", href: "/category/bags" },
              { label: "Kids Bags", href: "/category/kids-bags" },
              { label: "Sandals (Men)", href: "/category/sandals-men" },
              { label: "Sandals (Ladies)", href: "/category/sandals-ladies" },
              { label: "Sandals (Kids)", href: "/category/sandals-kids" },
              { label: "Backpacks", href: "/category/backpacks" },
              { label: "Weave Kiondo Sling Handbags", href: "/category/kiondo-sling-handbags" },
              { label: "African Wear", href: "/category/african-summer-wear" },
              { label: "Travel Bags", href: "/category/travel-bags" },
              { label: "Lunch Bag", href: "/category/lunch-bag" },
              { label: "Wash Bag", href: "/category/wash-bag" },
              { label: "Hoodies", href: "/category/hoodies" },
            ].map((c) => (
              <Card
                key={c.href}
                className="border-border/60 bg-black/35 p-5 text-white backdrop-blur"
              >
                <div className="text-sm text-white/70">Category</div>
                <div className="mt-1 text-lg font-bold">{c.label}</div>
                <p className="mt-2 text-sm text-white/75">
                  Tap to view products and order via WhatsApp checkout.
                </p>
                <Button asChild size="sm" variant="outline" className="mt-4 rounded-full bg-white/10">
                  <Link href={c.href}>Browse</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Featured Drops</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Quick picks customers love — tap to view details and sizes.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/shop">View all</Link>
          </Button>
        </div>

        <div className="mt-8">
          <ProductGrid products={products.slice(0, 4)} />
        </div>
      </section>

      {/* SOCIAL */}
      <section className="diagonal-cut relative bg-card">
        <div className="pointer-events-none absolute inset-0 grain" />
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Social → Sales</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Turn TikTok, Instagram, Facebook and WhatsApp into a single checkout flow.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full">
                  <Link href="/shop">Start shopping</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/contact">Contact & location</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Follow and shop from social — we reply fast on WhatsApp.
              </p>
            </div>

            <div className="grid gap-4">
              <Card className="p-4">
                <div className="text-sm font-semibold">TikTok</div>
                <p className="mt-1 text-sm text-muted-foreground">@afrisandies1223</p>
                <Button asChild variant="outline" className="mt-3 rounded-full">
                  <a href="https://www.tiktok.com/@afrisandies1223" target="_blank" rel="noreferrer">
                    Open TikTok
                  </a>
                </Button>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">Instagram</div>
                    <p className="mt-1 text-sm text-muted-foreground">@afrisandies1223</p>
                  </div>
                  <AtSign className="h-5 w-5 text-accent" />
                </div>
                <Button asChild variant="outline" className="mt-3 rounded-full">
                  <a href="https://www.instagram.com/afrisandies1223/" target="_blank" rel="noreferrer">
                    Open Instagram
                  </a>
                </Button>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">Facebook</div>
                    <p className="mt-1 text-sm text-muted-foreground">Afri Sandies</p>
                  </div>
                  <Globe className="h-5 w-5 text-accent" />
                </div>
                <Button asChild variant="outline" className="mt-3 rounded-full">
                  <a
                    href="https://www.facebook.com/people/Afri-Sandies/100068887821267/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Facebook
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER TRACKING */}
      <section id="order-tracking" className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Order Tracking</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              After you place an order, you’ll receive an Order ID (example: AF12345). To track delivery,
              WhatsApp us your Order ID and we’ll update you.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full">
                <a
                  href={`https://wa.me/254736836343?text=${encodeURIComponent(
                    "Hi AFRI SANDIES, I want to track my order. Order ID: ____"
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Track on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/contact">Other contact options</Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Tip: copy the Order ID from your checkout message and paste it into WhatsApp.
            </p>
          </div>

          <Card className="border-border/60 p-6">
            <div className="text-sm font-semibold">Example message</div>
            <div className="mt-3 rounded-xl border border-border/60 bg-muted p-4 text-sm">
              Hi AFRI SANDIES, I want to track my order. Order ID: AF12345
            </div>

            <Button
              variant="outline"
              className="mt-4 w-full rounded-full"
              onClick={() => copyToClipboard(orderTemplate)}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy WhatsApp order template
            </Button>

            <div className="mt-3 text-xs text-muted-foreground">Paybill Account: 0799606933 • WhatsApp/Call: 0736836343</div>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
