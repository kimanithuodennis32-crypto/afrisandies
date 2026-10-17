import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, UserRound, ShieldCheck, PhoneCall } from "lucide-react";

import logoLight from "@/assets/afri/logo/logo-light.svg";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import WhatsAppFab from "@/components/WhatsAppFab";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  // AFRI SANDIES design direction: Neo-African Luxury Brutalism
  // Large category set → keep nav horizontally scrollable.

  const [location] = useLocation();
  const { lines } = useCart();
  const cartCount = lines.reduce((s, l) => s + l.qty, 0);

  const nav = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Bags", href: "/category/bags" },
    { label: "Kids Bags", href: "/category/kids-bags" },
    { label: "African Wear", href: "/category/african-summer-wear" },
    { label: "Sandals (Men)", href: "/category/sandals-men" },
    { label: "Sandals (Ladies)", href: "/category/sandals-ladies" },
    { label: "Sandals (Kids)", href: "/category/sandals-kids" },
    { label: "Hoodies", href: "/category/hoodies" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2">
              <img
                src={logoLight}
                alt="AFRI SANDIES"
                className="h-14 w-auto max-w-[56vw] select-none sm:h-16 md:h-20"
                loading="eager"
              />
              <span className="sr-only">AFRI SANDIES</span>
            </Link>
            <span className="hidden md:inline text-xs text-muted-foreground">
              Where African Heritage Meets Modern Fashion
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 max-w-[50vw] overflow-x-auto">
            {nav.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors hover:bg-accent/15 hover:text-foreground",
                    active && "bg-accent/20"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href="/account" aria-label="Account">
                <UserRound className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Link href="/admin" aria-label="Admin">
                <ShieldCheck className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>

        {/* Mobile nav strip */}
        <div className="lg:hidden border-t border-border/50">
          <div className="mx-auto w-full max-w-6xl px-4 py-2 md:px-6">
            <div className="flex items-center gap-2 overflow-x-auto">
              {nav.map((item) => {
                const active = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors hover:bg-accent/15",
                      active && "bg-accent/20"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="relative mt-16 border-t border-border/60">
        <div className="pointer-events-none absolute inset-0 grain" />
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center">
                <img
                  src={logoLight}
                  alt="AFRI SANDIES"
                  className="h-16 w-auto max-w-[78vw] md:h-20"
                  loading="lazy"
                />
                <span className="sr-only">AFRI SANDIES</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Walk African. Wear Culture. Sandals, bags and more.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary">Mobile-first</Badge>
                <Badge variant="secondary">WhatsApp-friendly</Badge>
                <Badge variant="secondary">Kenya</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link className="text-muted-foreground hover:text-foreground" href="/shop">
                Shop
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/category/bags">
                Bags
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/category/kids-bags">
                Kids Bags
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/category/backpacks">
                Backpacks
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/category/kiondo-sling-handbags">
                Weave Kiondo Sling Handbags
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/category/african-summer-wear">
                African Wear
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/category/travel-bags">
                Travel Bags
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/category/lunch-bag">
                Lunch Bag
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/category/wash-bag">
                Wash Bag
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/category/hoodies">
                Hoodies
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/contact">
                Contact
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="/policies">
                Policies
              </Link>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold">Fast support</div>
              <p className="text-sm text-muted-foreground">
                Tap WhatsApp to order, ask about sizes, or track delivery.
              </p>
              <Button asChild className="w-full sm:w-auto">
                <a href="https://wa.me/254736836343" target="_blank" rel="noreferrer">
                  <PhoneCall className="mr-2 h-4 w-4" /> Chat on WhatsApp
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">Paybill Account: 0799606933</p>
              <p className="text-xs text-muted-foreground">WhatsApp/Call: 0736836343</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} AFRI SANDIES. All rights reserved.</div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Where African Heritage Meets Modern Fashion.
            </motion.div>
          </div>
        </div>
      </footer>

      <WhatsAppFab phone="254736836343" />
    </div>
  );
}
