import { MapPin, PhoneCall, AtSign, Globe, Video, CreditCard, Info } from "lucide-react";

import SiteShell from "@/components/SiteShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WHATSAPP_E164 = "254736836343";
const CONTACT_PRIMARY = "0736836343";
const CONTACT_ALT = "";

const MPESA_PAYBILL = "247247";
const MPESA_ACCOUNT = "0799606933";

const PICKUP_POINT = "Dynamic Mall, Tom Mboya Street, 3rd floor, Shop ML116";

export default function Contact() {
  const defaultMsg =
    "Hi AFRI SANDIES!\n\n" +
    "I want to order.\n\n" +
    "Product: ____\n" +
    "Size: ____\n" +
    "Color/Pattern: ____\n" +
    "Qty: ____\n\n" +
    "Name: ____\n" +
    "Phone: ____\n" +
    "Delivery: Pickup / Delivery\n" +
    "Delivery address (if delivery): ____\n\n" +
    `Pickup point: ${PICKUP_POINT}\n` +
    "Production time: 4–7 working days\n\n" +
    "Payment: M-Pesa Paybill\n" +
    `Paybill: ${MPESA_PAYBILL}\n` +
    `Paybill Account: ${MPESA_ACCOUNT}\n\n` +
    `WhatsApp/Call: ${CONTACT_PRIMARY}`;

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Contact & Pickup</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Fastest way to order is WhatsApp. You can also call us for quick sizing and customization.
            </p>

            <div className="mt-8 grid gap-4">
              <Card className="border-border/60 p-5">
                <div className="flex items-center gap-2 font-semibold">
                  <PhoneCall className="h-4 w-4 text-accent" /> Call / WhatsApp
                </div>
                <p className="mt-2 text-sm text-muted-foreground">WhatsApp/Call: {CONTACT_PRIMARY}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button asChild className="rounded-full">
                    <a
                      href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(
                        "Hi AFRI SANDIES! I want to order."
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Chat on WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <a href={`tel:${CONTACT_PRIMARY}`}>Call now</a>
                  </Button>
                </div>
              </Card>

              <Card className="border-border/60 p-5">
                <div className="flex items-center gap-2 font-semibold">
                  <MapPin className="h-4 w-4 text-accent" /> Pickup point
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{PICKUP_POINT}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Delivery is also available countrywide at a fee (we confirm the exact cost on WhatsApp).
                </p>
              </Card>

              <Card className="border-border/60 p-5">
                <div className="flex items-center gap-2 font-semibold">
                  <CreditCard className="h-4 w-4 text-accent" /> Payment (M-Pesa Paybill)
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Paybill:</span> <span className="font-semibold">{MPESA_PAYBILL}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Paybill Account:</span> <span className="font-semibold">{MPESA_ACCOUNT}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Sandals are made after a 50% deposit payment.
                  </p>
                </div>
              </Card>

              <Card className="border-border/60 p-5">
                <div className="flex items-center gap-2 font-semibold">
                  <Info className="h-4 w-4 text-accent" /> Key policies
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Production time takes 4–7 working days.</li>
                  <li>Returns, refitting and exchanges are accepted (please order correct sizes).</li>
                  <li>All sandals can be customized to your preference.</li>
                </ul>
                <Button asChild variant="outline" className="mt-4 rounded-full">
                  <a href="#/policies">Read full policies</a>
                </Button>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-border/60 p-5">
                  <div className="flex items-center gap-2 font-semibold">
                    <Video className="h-4 w-4 text-accent" /> TikTok
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">@afrisandies1223</p>
                  <Button asChild variant="outline" className="mt-4 rounded-full">
                    <a href="https://www.tiktok.com/@afrisandies1223" target="_blank" rel="noreferrer">
                      Open TikTok
                    </a>
                  </Button>
                </Card>

                <Card className="border-border/60 p-5">
                  <div className="flex items-center gap-2 font-semibold">
                    <AtSign className="h-4 w-4 text-accent" /> Instagram
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">@afrisandies1223</p>
                  <Button asChild variant="outline" className="mt-4 rounded-full">
                    <a href="https://www.instagram.com/afrisandies1223/" target="_blank" rel="noreferrer">
                      Open Instagram
                    </a>
                  </Button>
                </Card>

                <Card className="border-border/60 p-5 md:col-span-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Globe className="h-4 w-4 text-accent" /> Facebook
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Afri Sandies</p>
                  <Button asChild variant="outline" className="mt-4 rounded-full">
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

          <Card className="h-fit border-border/60 p-6">
            <h2 className="text-xl font-extrabold">Quick WhatsApp message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tap below to open WhatsApp with a ready-to-send message (edit the blanks before sending).
            </p>
            <Button asChild size="lg" className="mt-6 w-full rounded-full">
              <a href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(defaultMsg)}`} target="_blank" rel="noreferrer">
                Open WhatsApp
              </a>
            </Button>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
