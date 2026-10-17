import { useCallback, useEffect, useMemo, useState } from "react";
import { TrendingUp, Package, Users, Coins, Plus, Pencil, Trash2 } from "lucide-react";

import SiteShell from "@/components/SiteShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProductFormDialog from "@/components/admin/ProductFormDialog";

import { formatKes } from "@/lib/money";
import {
  adminLogin,
  ApiError,
  clearAdminToken,
  deleteProduct,
  getAdminStats,
  getAdminToken,
  listOrders,
  listProducts,
  setAdminToken,
  type AdminOrder,
  type AdminStats,
  type ApiProduct,
} from "@/lib/api";

function AdminLogin({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-24 md:px-6">
      <Card className="border-border/60 p-6">
        <h1 className="text-2xl font-extrabold">Admin login</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to view store data.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError("");
            try {
              const { token } = await adminLogin(email, password);
              setAdminToken(token);
              onLoggedIn();
            } catch (err) {
              setError(err instanceof ApiError ? err.message : "Couldn't reach the server.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full rounded-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(() => !!getAdminToken());
  const [liveStats, setLiveStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [loadError, setLoadError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    return Promise.all([getAdminStats(), listOrders({ limit: 5 }), listProducts()])
      .then(([stats, orderPage, productList]) => {
        setLiveStats(stats);
        setOrders(orderPage.orders);
        setApiProducts(productList);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearAdminToken();
          setLoggedIn(false);
          return;
        }
        setLoadError(err instanceof ApiError ? err.message : "Couldn't reach the server.");
      });
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    setLoadError("");
    refresh();
  }, [loggedIn, refresh]);

  const stats = useMemo(
    () => [
      { label: "Total Sales", value: liveStats ? formatKes(liveStats.totalSalesKes) : "—", icon: Coins },
      { label: "Orders Today", value: liveStats ? String(liveStats.ordersToday) : "—", icon: TrendingUp },
      { label: "Products", value: liveStats ? String(liveStats.productsCount) : String(apiProducts.length), icon: Package },
      { label: "Customers", value: liveStats ? String(liveStats.customersCount) : "—", icon: Users },
    ],
    [liveStats, apiProducts.length]
  );

  async function handleDelete(product: ApiProduct) {
    if (!window.confirm(`Delete "${product.title}"? This can't be undone.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      await refresh();
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Couldn't reach the server.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!loggedIn) {
    return (
      <SiteShell>
        <AdminLogin onLoggedIn={() => setLoggedIn(true)} />
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">Live data from the AFRI SANDIES API.</p>
          </div>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              clearAdminToken();
              setLoggedIn(false);
            }}
          >
            Log out
          </Button>
        </div>

        {loadError && <p className="mt-4 text-sm text-destructive">{loadError}</p>}

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-border/60 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{s.label}</div>
                <s.icon className="h-5 w-5 text-accent" />
              </div>
              <div className="mt-2 text-2xl font-extrabold">{s.value}</div>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold">Product management</h2>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setEditingProduct(undefined);
                  setFormOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add product
              </Button>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                        No products yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    apiProducts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-semibold">{p.title}</TableCell>
                        <TableCell className="text-right">{formatKes(p.priceKes)}</TableCell>
                        <TableCell className="text-right">{p.stock}</TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="rounded-full"
                              aria-label="Edit"
                              onClick={() => {
                                setEditingProduct(p);
                                setFormOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="rounded-full"
                              aria-label="Delete"
                              disabled={deletingId === p.id}
                              onClick={() => handleDelete(p)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Live from the backend — this is separate from the storefront's bundled catalog until that's
              migrated to the API too.
            </p>
          </Card>

          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Recent orders</h2>
            <p className="mt-2 text-sm text-muted-foreground">Latest orders placed through checkout.</p>

            <div className="mt-5 overflow-hidden rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                        No orders yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-semibold">{o.orderCode}</TableCell>
                        <TableCell>{o.customerName}</TableCell>
                        <TableCell className="text-right">{formatKes(o.totalKes)}</TableCell>
                        <TableCell className="text-right capitalize">{o.status}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </section>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSaved={refresh}
      />
    </SiteShell>
  );
}
