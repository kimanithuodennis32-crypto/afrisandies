import { useCallback, useEffect, useRef, useState } from "react";
import { CloudUpload, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiError,
  createGalleryItem,
  deleteGalleryItem,
  listGallery,
  updateGalleryItem,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/api";
import {
  cloudinaryConfigured,
  CloudinaryUploadError,
  optimizedImageUrl,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  event: "Event",
  customer: "Customer",
  other: "Other",
};

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState<GalleryCategory>("event");
  const [caption, setCaption] = useState("");
  const [pastedUrl, setPastedUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    listGallery()
      .then(setItems)
      .catch(() => setError("Couldn't load gallery photos."));
  }, []);

  useEffect(load, [load]);

  function fail(err: unknown) {
    if (err instanceof ApiError || err instanceof CloudinaryUploadError) setError(err.message);
    else setError("Something went wrong. Try again.");
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setError("");
    setBusy(true);
    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(`Uploading ${i + 1} of ${files.length}...`);
        const url = await uploadImageToCloudinary(files[i]);
        await createGalleryItem({ imageUrl: url, caption: caption.trim(), category });
      }
      setCaption("");
      load();
    } catch (err) {
      fail(err);
      load(); // show whichever photos did make it
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  async function handleAddUrl() {
    if (!pastedUrl.trim()) return;
    setError("");
    setBusy(true);
    try {
      await createGalleryItem({ imageUrl: pastedUrl.trim(), caption: caption.trim(), category });
      setPastedUrl("");
      setCaption("");
      load();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item: GalleryItem) {
    if (!window.confirm("Remove this photo from the gallery?")) return;
    try {
      await deleteGalleryItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      fail(err);
    }
  }

  async function handleCategoryChange(item: GalleryItem, next: GalleryCategory) {
    try {
      const updated = await updateGalleryItem(item.id, { category: next });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch (err) {
      fail(err);
    }
  }

  return (
    <Card className="mt-6 border-border/60 p-6">
      <h2 className="text-xl font-extrabold">Gallery</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Photos from events and happy customers. They appear on the public Gallery page straight away.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as GalleryCategory)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          >
            <option value="event">Event</option>
            <option value="customer">Customer appreciation</option>
            <option value="other">Behind the scenes / other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Caption (optional, applied to this upload)</Label>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Nairobi Trade Fair 2026"
            maxLength={300}
          />
        </div>
      </div>

      <div className="mt-4">
        {cloudinaryConfigured ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
            <Button type="button" disabled={busy} onClick={() => fileInputRef.current?.click()}>
              <CloudUpload className="mr-2 h-4 w-4" />
              {busy ? progress || "Working..." : "Upload photos"}
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">You can pick several photos at once.</p>
          </>
        ) : (
          <div className="space-y-2">
            <Label>Photo link</Label>
            <div className="flex gap-2">
              <Input value={pastedUrl} onChange={(e) => setPastedUrl(e.target.value)} placeholder="https://..." />
              <Button type="button" disabled={busy || !pastedUrl.trim()} onClick={handleAddUrl}>
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Direct uploads need Cloudinary set up (see the README). Until then you can paste an image link.
            </p>
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground">No gallery photos yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-border/60">
              <img
                src={optimizedImageUrl(item.imageUrl, 300)}
                alt={item.caption || "Gallery photo"}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <div className="space-y-1 p-2">
                {item.caption && <p className="truncate text-xs text-muted-foreground">{item.caption}</p>}
                <div className="flex items-center justify-between gap-1">
                  <select
                    value={item.category}
                    onChange={(e) => handleCategoryChange(item, e.target.value as GalleryCategory)}
                    className="h-7 rounded border border-input bg-transparent px-1 text-xs"
                    aria-label="Photo type"
                  >
                    {(Object.keys(CATEGORY_LABELS) as GalleryCategory[]).map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full"
                    aria-label="Delete photo"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
