import { Link } from "wouter";

import SiteShell from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6">
        <Card className="border-border/60 p-8">
          <div className="text-sm text-muted-foreground">404</div>
          <h1 className="mt-2 text-3xl font-extrabold">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you’re looking for doesn’t exist. Use the links below to continue shopping.
          </p>
          <div className="mt-6 flex gap-2">
            <Button asChild className="rounded-full">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
