import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";

import SiteShell from "@/components/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiError,
  clearCustomerToken,
  customerLogin,
  customerRegister,
  getCustomerToken,
  getMyProfile,
  listMyOrders,
  setCustomerToken,
  type Customer,
  type CustomerOrder,
} from "@/lib/api";
import { formatKes } from "@/lib/money";

const STATUS_LABELS: Record<string, { label: string; hint: string }> = {
  pending: { label: "Awaiting payment", hint: "Pay via M-Pesa Paybill, then send us the code on WhatsApp." },
  confirmed: { label: "Payment confirmed", hint: "We've received your payment." },
  processing: { label: "Being made", hint: "Your order is in production." },
  shipped: { label: "On the way", hint: "Your order has been sent out for delivery." },
  completed: { label: "Delivered", hint: "Thank you for shopping with AFRI SANDIES!" },
  cancelled: { label: "Cancelled", hint: "This order was cancelled. Message us if this is a mistake." },
};

function statusInfo(status: string) {
  return STATUS_LABELS[status] ?? { label: status, hint: "" };
}

function AuthCard({ onDone }: { onDone: (c: Customer) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result =
        mode === "login"
          ? await customerLogin(email.trim(), password)
          : await customerRegister({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
      setCustomerToken(result.token);
      onDone(result.customer);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-border/60 p-6">
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          className="rounded-full"
          variant={mode === "login" ? "default" : "outline"}
          onClick={() => setMode("login")}
        >
          Log in
        </Button>
        <Button
          type="button"
          size="sm"
          className="rounded-full"
          variant={mode === "register" ? "default" : "outline"}
          onClick={() => setMode("register")}
        >
          Create account
        </Button>
      </div>

      <h2 className="mt-5 text-xl font-extrabold">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "login"
          ? "Log in to see your orders and their status."
          : "Orders you place while logged in are saved here so you can track them."}
      </p>

      <form className="mt-5 space-y-4" onSubmit={submit}>
        {mode === "register" && (
          <>
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07..."
                required
                minLength={8}
                autoComplete="tel"
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={mode === "register" ? 8 : 1}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          {mode === "register" && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full rounded-full" disabled={busy}>
          {busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
        </Button>
      </form>
    </Card>
  );
}

function OrderCard({ order }: { order: CustomerOrder }) {
  const info = statusInfo(order.status);
  const date = new Date(order.createdAt).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <Card className="border-border/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-lg font-extrabold">Order #{order.orderCode}</div>
          <div className="text-xs text-muted-foreground">{date}</div>
        </div>
        <Badge variant={order.status === "cancelled" ? "destructive" : "secondary"}>{info.label}</Badge>
      </div>
      {info.hint && <p className="mt-2 text-sm text-muted-foreground">{info.hint}</p>}

      <ul className="mt-4 space-y-1 text-sm">
        {order.lines.map((l) => {
          const meta = [l.size ? `Size ${l.size}` : "", l.color ?? "", l.pattern ?? ""].filter(Boolean).join(" • ");
          return (
            <li key={l.id} className="flex justify-between gap-3">
              <span>
                {l.qty} × {l.productTitle}
                {meta && <span className="text-muted-foreground"> ({meta})</span>}
              </span>
              <span className="whitespace-nowrap">{formatKes(l.unitPriceKes * l.qty)}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
        <div className="text-sm">
          {order.shippingKes > 0 && (
            <span className="mr-3 text-muted-foreground">Delivery {formatKes(order.shippingKes)}</span>
          )}
          <span className="font-extrabold text-accent">Total {formatKes(order.totalKes)}</span>
        </div>
        <Button asChild size="sm" variant="outline" className="rounded-full">
          <a
            href={`https://wa.me/254736836343?text=${encodeURIComponent(
              `Hi AFRI SANDIES, I'm asking about my order ${order.orderCode}.`
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            Ask on WhatsApp
          </a>
        </Button>
      </div>
    </Card>
  );
}

export default function Account() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(() => !!getCustomerToken());
  const [error, setError] = useState("");

  const logout = useCallback(() => {
    clearCustomerToken();
    setCustomer(null);
    setOrders([]);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [me, myOrders] = await Promise.all([getMyProfile(), listMyOrders()]);
      setCustomer(me);
      setOrders(myOrders);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout(); // expired or invalid session
      } else {
        setError("Couldn't load your orders right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (getCustomerToken()) load();
  }, [load]);

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {customer ? `Hi, ${customer.name.split(" ")[0]}` : "My account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {customer ? customer.email : "Log in to see your orders and track their progress."}
            </p>
          </div>
          {customer && (
            <Button variant="outline" className="rounded-full" onClick={logout}>
              Log out
            </Button>
          )}
        </div>

        {loading && <p className="mt-10 text-sm text-muted-foreground">Loading...</p>}

        {!loading && !customer && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <AuthCard
              onDone={() => {
                load();
              }}
            />
            <Card className="border-border/60 p-6">
              <h2 className="text-xl font-extrabold">No account? No problem.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You can still order as a guest and track it on WhatsApp using your Order ID. Create an account if you
                want all your orders in one place.
              </p>
              <Button asChild className="mt-5 rounded-full" variant="outline">
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
              <p className="mt-3 text-xs text-muted-foreground">
                Paybill Account: 0799606933 • WhatsApp/Call: 0736836343
              </p>
            </Card>
          </div>
        )}

        {!loading && customer && (
          <div className="mt-10">
            <h2 className="text-xl font-extrabold">Your orders</h2>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            {orders.length === 0 ? (
              <Card className="mt-4 border-border/60 p-6">
                <p className="text-sm text-muted-foreground">
                  No orders in your account yet. Orders you place while logged in will appear here.
                </p>
                <Button asChild className="mt-4 rounded-full">
                  <Link href="/shop">Start shopping</Link>
                </Button>
              </Card>
            ) : (
              <div className="mt-4 space-y-4">
                {orders.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
