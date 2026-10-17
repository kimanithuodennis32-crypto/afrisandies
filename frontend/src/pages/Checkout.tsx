import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

import SiteShell from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import { useCart, getLineKey } from "@/store/cart";
import { formatKes } from "@/lib/money";
import { createOrder, ApiError } from "@/lib/api";

const SHIPPING_KES = 300; // delivery fee varies by location; this is a starting estimate
const WHATSAPP_E164 = "254736836343";
const CONTACT_PRIMARY = "0736836343";
const CONTACT_ALT = "";

const MPESA_PAYBILL = "247247";
const MPESA_ACCOUNT = "0799606933";

const PICKUP_POINT = "Dynamic Mall, Tom Mboya Street, 3rd floor, Shop ML116";
const PRODUCTION_DAYS = "4–7 working days";

type DeliveryMethod = "home" | "pickup";

export default function Checkout() {
  const { lines, subtotalKes, clear } = useCart();

  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [confirmedTotalKes, setConfirmedTotalKes] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [delivery, setDelivery] = useState<DeliveryMethod>("home");

  const shippingKes = lines.length > 0 && delivery === "home" ? SHIPPING_KES : 0;
  const totalKes = subtotalKes + shippingKes;

  const canSubmit =
    name.trim().length >= 2 &&
    phone.trim().length >= 8 &&
    (delivery === "pickup" || address.trim().length >= 3);

  if (lines.length === 0 && !done) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6">
          <h1 className="text-3xl font-extrabold">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/shop">Go to Shop</Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Checkout</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill your details then send the full order to WhatsApp. Payment is via M-Pesa Paybill.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/cart">Back to cart</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {done ? (
              <Card className="border-border/60 p-8">
                <div className="text-sm text-muted-foreground">Order sent!</div>
                <h2 className="mt-2 text-3xl font-extrabold">Order #{orderId}</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  We’ll confirm your payment on WhatsApp and start processing.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Card className="border-border/60 p-4">
                    <div className="text-xs text-muted-foreground">M-Pesa Paybill</div>
                    <div className="mt-1 text-lg font-bold">Paybill {MPESA_PAYBILL}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Account: {MPESA_ACCOUNT}</div>
                  </Card>
                  <Card className="border-border/60 p-4">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="mt-1 text-lg font-bold text-accent">{formatKes(confirmedTotalKes)}</div>
                  </Card>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="rounded-full">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      const msg = `Hi AFRI SANDIES, I've paid for Order ${orderId}. M-Pesa code: ________ (Paybill ${MPESA_PAYBILL}, Account ${MPESA_ACCOUNT})`;
                      window.open(`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(msg)}`, "_blank");
                    }}
                  >
                    Send payment code on WhatsApp
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card className="border-border/60 p-6">
                  <h2 className="text-xl font-extrabold">Customer details</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    These details will be included in the WhatsApp order message.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07..." />
                    </div>
                    <div className="space-y-2">
                      <Label>County</Label>
                      <Input value={county} onChange={(e) => setCounty(e.target.value)} placeholder="Nairobi" />
                    </div>
                    <div className="space-y-2">
                      <Label>Town</Label>
                      <Input value={town} onChange={(e) => setTown(e.target.value)} placeholder="Westlands" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Delivery address (for delivery only)</Label>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Building, street, landmark..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Required for delivery. If you choose pickup, you can leave this blank.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="border-border/60 p-6">
                  <h2 className="text-xl font-extrabold">Delivery</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Pickup point: {PICKUP_POINT}. Delivery is available countrywide at a fee (we confirm the exact cost
                    on WhatsApp).
                  </p>
                  <RadioGroup
                    className="mt-6 grid gap-3"
                    value={delivery}
                    onValueChange={(v) => setDelivery(v as DeliveryMethod)}
                  >
                    <label className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                      <RadioGroupItem value="home" id="home" />
                      <div>
                        <div className="font-semibold">Home delivery</div>
                        <div className="text-xs text-muted-foreground">Door to door convenience</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <div>
                        <div className="font-semibold">Pickup</div>
                        <div className="text-xs text-muted-foreground">{PICKUP_POINT}</div>
                      </div>
                    </label>
                  </RadioGroup>
                </Card>

                <Card className="border-border/60 p-6">
                  <h2 className="text-xl font-extrabold">Payment (M-Pesa)</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You’ll pay after sending the order. Then send the M-Pesa code on WhatsApp for confirmation.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/60 p-4">
                      <div className="text-xs text-muted-foreground">M-Pesa method</div>
                      <div className="mt-1 text-base font-bold">Paybill</div>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <div className="text-xs text-muted-foreground">Delivery fee</div>
                      <div className="mt-1 text-base font-bold">{formatKes(SHIPPING_KES)}</div>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4 sm:col-span-2">
                      <div className="text-xs text-muted-foreground">Paybill</div>
                      <div className="mt-1 text-lg font-extrabold text-accent">{MPESA_PAYBILL}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Account: {MPESA_ACCOUNT}</div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                      size="lg"
                      className="rounded-full"
                      disabled={!canSubmit || submitting}
                      onClick={async () => {
                        setSubmitting(true);
                        try {
                          const { order, whatsappUrl } = await createOrder({
                            name,
                            phone,
                            county: county || undefined,
                            town: town || undefined,
                            address: address || undefined,
                            delivery,
                            lines: lines.map((l) => ({
                              productId: l.productId,
                              qty: l.qty,
                              size: l.size,
                              color: l.color,
                              pattern: l.pattern,
                            })),
                          });
                          window.open(whatsappUrl, "_blank");
                          setOrderId(order.orderCode);
                          setConfirmedTotalKes(order.totalKes);
                          setDone(true);
                          clear();
                        } catch (err) {
                          const message =
                            err instanceof ApiError
                              ? err.message
                              : "Couldn't reach the server. Check your connection and try again.";
                          toast.error(message);
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                    >
                      {submitting ? "Sending..." : "Send Order on WhatsApp"}
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full">
                      <Link href="/shop">Add more items</Link>
                    </Button>
                  </div>

                  {!canSubmit && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Please enter at least: Name, Phone, and Delivery address.
                    </p>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* Summary */}
          <Card className="h-fit border-border/60 p-5">
            <div className="text-lg font-bold">Order Summary</div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              {lines.map((l) => (
                <div key={getLineKey(l)} className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">
                      {l.qty} × {l.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {l.size ? `Size ${l.size}` : ""}
                      {(l.size && l.color) || (l.size && l.pattern) ? " • " : ""}
                      {l.color ? `Color ${l.color}` : ""}
                      {l.color && l.pattern ? " • " : ""}
                      {l.pattern ? `Pattern ${l.pattern}` : ""}
                    </div>
                  </div>
                  <div className="font-semibold">{formatKes(l.qty * l.unitPriceKes)}</div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatKes(subtotalKes)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">{formatKes(shippingKes)} </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-base font-extrabold text-accent">{formatKes(totalKes)}</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">Paybill Account: {MPESA_ACCOUNT} • WhatsApp/Call: {CONTACT_PRIMARY}</div>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
