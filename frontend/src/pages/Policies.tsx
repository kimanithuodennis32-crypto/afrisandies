import SiteShell from "@/components/SiteShell";
import { Card } from "@/components/ui/card";

const CONTACT_PRIMARY = "0736836343";
const CONTACT_ALT = "";

const MPESA_PAYBILL = "247247";
const MPESA_ACCOUNT = "0799606933";

const PICKUP_POINT = "Dynamic Mall, Tom Mboya Street, 3rd floor, Shop ML116";

export default function Policies() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight">Policies</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Clear information so you can order confidently. If anything is unclear, WhatsApp us.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Production time</h2>
            <p className="mt-2 text-sm text-muted-foreground">Production takes 4–7 working days.</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Custom work may take slightly longer depending on design and availability.
            </p>
          </Card>

          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Pickup & delivery</h2>
            <div className="mt-2 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">Pickup point:</span> {PICKUP_POINT}
              </div>
              <div className="mt-2">
                <span className="font-semibold text-foreground">Delivery:</span> Countrywide delivery is available at a
                fee (we confirm the exact cost on WhatsApp).
              </div>
            </div>
          </Card>

          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Payment (M-Pesa Paybill)</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pay via M-Pesa Paybill, then send your M-Pesa code on WhatsApp for confirmation.
            </p>
            <div className="mt-4 rounded-xl border border-border/60 p-4">
              <div className="text-xs text-muted-foreground">Paybill</div>
              <div className="mt-1 text-lg font-extrabold text-accent">{MPESA_PAYBILL}</div>
              <div className="mt-3 text-xs text-muted-foreground">Paybill Account</div>
              <div className="mt-1 text-lg font-extrabold text-accent">{MPESA_ACCOUNT}</div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Sandals are made only after a 50% deposit payment.
            </p>
          </Card>

          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Returns, refitting & exchanges</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We accept returns, refitting and exchanges. Kindly order the right sizes to avoid wastage.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Please contact us as soon as possible after delivery for guidance on next steps.
            </p>
          </Card>

          <Card className="border-border/60 p-6 lg:col-span-2">
            <h2 className="text-xl font-extrabold">Customization</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              All sandals can be customized to your preference/liking. Send a photo or describe what you want on
              WhatsApp.
            </p>
            <div className="mt-4 rounded-xl border border-border/60 p-4 text-sm text-muted-foreground">
              <div className="font-semibold text-foreground">Paybill Account</div>
              <div className="mt-1">{MPESA_ACCOUNT}</div>
              <div className="mt-3 font-semibold text-foreground">WhatsApp/Call</div>
              <div className="mt-1">{CONTACT_PRIMARY}</div>
            </div>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
