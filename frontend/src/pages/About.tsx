import SiteShell from "@/components/SiteShell";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight">About AFRI SANDIES</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Where African Heritage Meets Modern Fashion.
        </p>

        <div className="mt-10 grid gap-4">
          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">The idea</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              AFRI SANDIES is built around premium handmade pieces that carry culture — but feel modern,
              clean, and wearable every day.
            </p>
          </Card>

          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">What we sell</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Bags • Sandals (Men/Ladies/Kids) • Backpacks • Hoodies • Travel bags — designed to stand out on the street
              and on camera.
            </p>
          </Card>

          <Card className="border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Mobile-first brand</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Many customers discover you on TikTok/Instagram/Facebook. This website is designed to
              convert fast: browse → cart → checkout → WhatsApp follow-up.
            </p>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
