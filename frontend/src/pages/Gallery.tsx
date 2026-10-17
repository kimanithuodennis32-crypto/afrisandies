import { useEffect, useMemo, useState } from "react";

import SiteShell from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { listGallery, type GalleryCategory, type GalleryItem } from "@/lib/api";
import { optimizedImageUrl } from "@/lib/cloudinary";

const FILTERS: { value: "all" | GalleryCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "event", label: "Events" },
  { value: "customer", label: "Happy customers" },
  { value: "other", label: "Behind the scenes" },
];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [filter, setFilter] = useState<"all" | GalleryCategory>("all");
  const [active, setActive] = useState<GalleryItem | null>(null);

  useEffect(() => {
    listGallery()
      .then((data) => {
        setItems(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [items, filter]
  );

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Gallery</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Moments from events we've attended and kind words and photos from our customers.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={filter === f.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {status === "loading" && <p className="mt-10 text-sm text-muted-foreground">Loading photos...</p>}
        {status === "error" && (
          <p className="mt-10 text-sm text-muted-foreground">
            Couldn't load the gallery right now. Please refresh in a moment.
          </p>
        )}
        {status === "ready" && visible.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">No photos here yet. Check back soon!</p>
        )}

        <div className="mt-8 columns-2 gap-3 md:columns-3 lg:columns-4">
          {visible.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className="group mb-3 block w-full overflow-hidden rounded-xl border border-border/60 text-left"
            >
              <img
                src={optimizedImageUrl(item.imageUrl, 600)}
                alt={item.caption || "AFRI SANDIES gallery photo"}
                loading="lazy"
                className="w-full transition-transform duration-300 group-hover:scale-[1.03]"
              />
              {item.caption && (
                <span className="block px-3 py-2 text-xs text-muted-foreground">{item.caption}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-3">
          <DialogTitle className="sr-only">{active?.caption || "Gallery photo"}</DialogTitle>
          <DialogDescription className="sr-only">Full size gallery photo</DialogDescription>
          {active && (
            <>
              <img
                src={optimizedImageUrl(active.imageUrl, 1600)}
                alt={active.caption || "AFRI SANDIES gallery photo"}
                className="mx-auto max-h-[75vh] w-auto rounded-lg object-contain"
              />
              {active.caption && <p className="px-1 pt-2 text-sm text-muted-foreground">{active.caption}</p>}
            </>
          )}
        </DialogContent>
      </Dialog>
    </SiteShell>
  );
}
