import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Star, Minus, Plus, MessageCircle } from "lucide-react";

import SiteShell from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { getProduct } from "@/data/products";
import { formatKes } from "@/lib/money";
import type { ProductColor, ProductSize } from "@/data/types";
import { useCart } from "@/store/cart";

const WHATSAPP_E164 = "254736836343";
const CONTACT_PRIMARY = "0736836343";
const CONTACT_ALT = "";

const MPESA_PAYBILL = "247247";
const MPESA_ACCOUNT = "0799606933";

const PICKUP_POINT = "Dynamic Mall, Tom Mboya Street, 3rd floor, Shop ML116";
const DELIVERY_FEE_KES = 300; // delivery fee varies by location; this is a starting estimate
const PRODUCTION_DAYS = "4–7 working days";

export default function Product({ id }: { id: string }) {
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const product = getProduct(id);

  const [imageIdx, setImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const defaultSize = useMemo(() => product?.sizes?.find((s) => s !== 1), [product]);
  const [size, setSize] = useState<ProductSize | undefined>(defaultSize);
  const [color, setColor] = useState<ProductColor | undefined>(product?.colors?.[0]);

  const defaultPattern = useMemo(() => product?.patterns?.[0]?.label, [product]);
  const [pattern, setPattern] = useState<string | undefined>(defaultPattern);

  useEffect(() => {
    setImageIdx(0);
    setQty(1);
    setSize(defaultSize);
    setColor(product?.colors?.[0]);
    setPattern(defaultPattern);
  }, [product?.id]);

  if (!product) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6">
          <h1 className="text-3xl font-extrabold">Product not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">Try browsing the shop.</p>
          <Button asChild variant="outline" className="mt-6 rounded-full">
            <Link href="/shop">Go to Shop</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  const activePattern = product.patterns?.find((p) => p.label === pattern) ?? product.patterns?.[0];
  const images = activePattern?.images?.length ? activePattern.images : product.images;
  const activeImage = images[Math.min(imageIdx, images.length - 1)];

  const isHisHers = product.id.includes("his-hers");
  const pairId = isHisHers
    ? product.id.includes("-men-")
      ? "sandals-ladies-his-hers"
      : "sandals-men-his-hers"
    : null;
  const pairLabel = isHisHers
    ? product.id.includes("-men-")
      ? "View Hers (Ladies)"
      : "View His (Men)"
    : null;

  const unitPriceKes = product.sizePricing && size != null ? product.sizePricing[String(size)] ?? product.priceKes : product.priceKes;
  const unitTotalKes = unitPriceKes * qty;
  const grandTotalKes = unitTotalKes + DELIVERY_FEE_KES;

  const sizeLabel = product.sizes.includes(1) ? "One size" : size ? String(size) : "____";
  const colorLabel = color ?? "____";
  const patternLabel = pattern ?? "____";

  function parseSize(value: string): ProductSize {
    const n = Number(value);
    if (Number.isFinite(n) && String(n) === value) return n;
    return value;
  }

  const whatsAppMsg =
    `Hi AFRI SANDIES, I want to order:\n\n` +
    `Product: ${product.title}\n` +
    `Qty: ${qty}\n` +
    `Size: ${sizeLabel}\n` +
    (product.patterns?.length ? `Pattern: ${patternLabel}\n` : "") +
    `Color: ${colorLabel}\n\n` +
    `Items total: ${formatKes(unitTotalKes)}\n` +
    `Delivery fee: ${formatKes(DELIVERY_FEE_KES)}\n` +
    `Total: ${formatKes(grandTotalKes)}\n\n` +
    `Name: ____\n` +
    `Phone: ____\n` +
    `County/Town: ____\n` +
    `Delivery address: ____\n\n` +
    `Production time: ${PRODUCTION_DAYS}\n` +
    `Pickup point: ${PICKUP_POINT}\n\n` +
    (product.category === "sandals"
      ? `Note: Sandals are made after a 50% deposit.\n\n`
      : "") +
    `Payment: M-Pesa Paybill\n` +
    `Paybill: ${MPESA_PAYBILL}\n` +
    `Paybill Account: ${MPESA_ACCOUNT}\n\n` +
    `After paying, send the M-Pesa code here.\n` +
    `WhatsApp/Call: ${CONTACT_PRIMARY}`;

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/shop">← Back</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/cart">Cart</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            <Card className="overflow-hidden border-border/60">
              <div className="aspect-square bg-muted">
                <img src={activeImage.src} alt={activeImage.alt} className="h-full w-full object-cover" />
              </div>
            </Card>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.src}
                    className={`h-16 w-16 overflow-hidden rounded-xl border ${
                      idx === imageIdx ? "border-accent" : "border-border/60"
                    }`}
                    onClick={() => setImageIdx(idx)}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">{product.title}</h1>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xl font-bold text-accent">{formatKes(unitPriceKes)}</span>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-accent text-accent" /> {product.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <Badge variant="secondary">Handcrafted</Badge>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm font-semibold">Size</div>
                {product.sizes.includes(1) ? (
                  <div className="mt-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-sm text-muted-foreground">
                    Ask size on WhatsApp
                  </div>
                ) : (
                  <Select value={size != null ? String(size) : undefined} onValueChange={(v) => setSize(parseSize(v))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes
                        .filter((s) => s !== 1)
                        .map((s) => (
                          <SelectItem key={s} value={String(s)}>
                            {s}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                {product.patterns?.length ? (
                  <>
                    <div className="text-sm font-semibold">Design pattern</div>
                    <Select
                      value={pattern}
                      onValueChange={(v) => {
                        setPattern(v);
                        setImageIdx(0);
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.patterns.map((p) => (
                          <SelectItem key={p.id} value={p.label}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-semibold">Color</div>
                    <Select value={color} onValueChange={(v) => setColor(v as ProductColor)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.colors.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>

              <div className="sm:col-span-2">
                <div className="text-sm font-semibold">Quantity</div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-2 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-10 text-center text-sm font-semibold">{qty}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="rounded-full"
                onClick={() => addToCart({ product, qty, size, color, pattern })}
              >
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  addToCart({ product, qty, size, color, pattern });
                  setLocation("/checkout");
                }}
              >
                Buy Now
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="rounded-full"
                onClick={() => {
                  window.open(
                    `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(whatsAppMsg)}`,
                    "_blank"
                  );
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Order on WhatsApp
              </Button>
            </div>

            {isHisHers && pairId && pairLabel && (
              <Card className="mt-4 border-border/60 p-4">
                <div className="text-sm font-semibold">His & Hers Pair</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Same unisex design — choose Men or Ladies pricing.
                </p>
                <Button
                  variant="outline"
                  className="mt-3 rounded-full"
                  onClick={() => setLocation(`/product/${pairId}`)}
                >
                  {pairLabel}
                </Button>
              </Card>
            )}

            <div className="mt-10">
              <Tabs defaultValue="description">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4 text-sm text-muted-foreground">
                  {product.description}
                </TabsContent>
                <TabsContent value="materials" className="mt-4 text-sm text-muted-foreground">
                  {product.materials}
                </TabsContent>
                <TabsContent value="shipping" className="mt-4 text-sm text-muted-foreground">
                  <div className="space-y-3">
                    <div>{product.shipping}</div>
                    <div>
                      <span className="font-semibold text-foreground">Production time:</span> {PRODUCTION_DAYS}.
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Pickup point:</span> {PICKUP_POINT}.
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Delivery:</span> Countrywide delivery is available
                      at a fee (we confirm the exact cost on WhatsApp).
                    </div>
                    {product.category === "sandals" && (
                      <div>
                        <span className="font-semibold text-foreground">Deposit:</span> Sandals are made after a 50%
                        deposit via Paybill {MPESA_PAYBILL} (Account {MPESA_ACCOUNT}).
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-foreground">Paybill Account:</span> {MPESA_ACCOUNT}
                      <br />
                      <span className="font-semibold text-foreground">WhatsApp/Call:</span> {CONTACT_PRIMARY}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4 text-sm text-muted-foreground">
                  Reviews are shared on WhatsApp — message us for customer photos and feedback.
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
