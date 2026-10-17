import { Link } from "wouter";
import { Trash2 } from "lucide-react";

import SiteShell from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { useCart, getLineKey } from "@/store/cart";
import { formatKes } from "@/lib/money";

const SHIPPING_KES = 300;

export default function Cart() {
  const { lines, subtotalKes, updateQty, removeLine, clear } = useCart();
  const totalKes = subtotalKes + (lines.length > 0 ? SHIPPING_KES : 0);

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Shopping Cart</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Review items, adjust quantities, then proceed to checkout.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/shop">Continue shopping</Link>
            </Button>
            {lines.length > 0 && (
              <Button variant="ghost" className="rounded-full" onClick={clear}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {lines.length === 0 ? (
          <Card className="mt-10 p-8 border-border/60">
            <div className="text-lg font-bold">Your cart is empty</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Start with sandals, bags, or African wear — made for comfort and presence.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </Card>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {lines.map((l) => {
                const key = getLineKey(l);
                return (
                  <Card key={key} className="p-4 border-border/60">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-xl bg-muted">
                        <img src={l.imageSrc} alt={l.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold">{l.title}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {l.size ? `Size ${l.size}` : ""}
                              {(l.size && l.color) || (l.size && l.pattern) ? " • " : ""}
                              {l.color ? `Color ${l.color}` : ""}
                              {(l.color && l.pattern) ? " • " : ""}
                              {l.pattern ? `Pattern ${l.pattern}` : ""}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => removeLine(key)}
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-accent">
                            {formatKes(l.unitPriceKes)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Qty</span>
                            <Input
                              className="h-9 w-20"
                              type="number"
                              min={1}
                              value={l.qty}
                              onChange={(e) => updateQty(key, Number(e.target.value || 1))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="h-fit border-border/60 p-5">
              <div className="text-lg font-bold">Summary</div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatKes(subtotalKes)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">{formatKes(SHIPPING_KES)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-base font-extrabold text-accent">{formatKes(totalKes)}</span>
                </div>
              </div>
              <Button asChild size="lg" className="mt-5 w-full rounded-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Pickup: Dynamic Mall, Tom Mboya Street, 3rd floor, Shop ML116. Delivery is available countrywide at a
                fee (confirmed on WhatsApp).
              </p>
            </Card>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
