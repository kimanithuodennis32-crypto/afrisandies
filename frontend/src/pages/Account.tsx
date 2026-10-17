import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SiteShell from "@/components/SiteShell";

export default function Account() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Customer area (coming soon). For now, order tracking is done via WhatsApp using your Order ID.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Login</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Online login will be added later. For now, order via WhatsApp and keep your Order ID.
            </p>
            <Button className="mt-5 rounded-full" variant="outline">
              Login (coming soon)
            </Button>
          </Card>

          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Order tracking</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Track delivery by sending your Order ID on WhatsApp.
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
            <p className="mt-3 text-xs text-muted-foreground">Paybill Account: 0799606933 • WhatsApp/Call: 0736836343</p>
          </Card>

          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Saved addresses</h2>
            <p className="mt-2 text-sm text-muted-foreground">Store delivery details for faster checkout.</p>
          </Card>

          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Wishlist</h2>
            <p className="mt-2 text-sm text-muted-foreground">Save items you love for later.</p>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
