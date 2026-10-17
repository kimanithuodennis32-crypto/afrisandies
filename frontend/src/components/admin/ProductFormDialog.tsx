import { useEffect, useRef, useState } from "react";
import { CloudUpload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ApiError, createProduct, updateProduct, type ApiProduct, type ProductInput } from "@/lib/api";
import { cloudinaryConfigured, uploadImageToCloudinary, CloudinaryUploadError } from "@/lib/cloudinary";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ApiProduct; // present = editing, absent = creating
  onSaved: () => void;
}

function parseListInput(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSizesInput(raw: string): (string | number)[] {
  return parseListInput(raw).map((s) => (/^\d+$/.test(s) ? Number(s) : s));
}

const emptyForm = {
  id: "",
  title: "",
  priceKes: "",
  rating: "4.5",
  category: "sandals" as ApiProduct["category"],
  subcategory: "",
  stock: "50",
  colors: "",
  sizes: "",
  description: "",
  materials: "",
  shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
};

export default function ProductFormDialog({ open, onOpenChange, product, onSaved }: ProductFormDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [pastedUrl, setPastedUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!product;

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        id: product.id,
        title: product.title,
        priceKes: String(product.priceKes),
        rating: String(product.rating),
        category: product.category,
        subcategory: product.subcategory ?? "",
        stock: String(product.stock),
        colors: product.colors.join(", "),
        sizes: product.sizes.join(", "),
        description: product.description,
        materials: product.materials,
        shipping: product.shipping,
      });
      setImages(product.images);
    } else {
      setForm(emptyForm);
      setImages([]);
    }
    setPastedUrl("");
    setError("");
  }, [open, product]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same files later
    if (files.length === 0) return;

    setError("");
    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadImageToCloudinary(file);
        const alt = form.title.trim() || file.name;
        setImages((prev) => [...prev, { src: url, alt }]);
      }
    } catch (err) {
      setError(err instanceof CloudinaryUploadError ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  function addPastedUrl() {
    const url = pastedUrl.trim();
    if (!url) return;
    setImages((prev) => [...prev, { src: url, alt: form.title.trim() || "Product photo" }]);
    setPastedUrl("");
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function makeMainImage(index: number) {
    setImages((prev) => [prev[index], ...prev.filter((_, i) => i !== index)]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const priceKes = Number(form.priceKes);
    const rating = Number(form.rating);
    const stock = Number(form.stock);
    if (!Number.isFinite(priceKes) || priceKes <= 0) return setError("Price must be a positive number.");
    if (images.length === 0) return setError("Add at least one product photo.");

    const payload: ProductInput = {
      title: form.title.trim(),
      priceKes,
      rating: Number.isFinite(rating) ? rating : 4.5,
      category: form.category,
      subcategory: form.subcategory.trim() || undefined,
      stock: Number.isFinite(stock) ? stock : 0,
      images: images.map((img) => ({ src: img.src, alt: img.alt || form.title.trim() || "Product photo" })),
      colors: parseListInput(form.colors),
      sizes: parseSizesInput(form.sizes),
      description: form.description.trim(),
      materials: form.materials.trim(),
      shipping: form.shipping.trim(),
    };

    setSubmitting(true);
    try {
      if (isEditing && product) {
        await updateProduct(product.id, payload);
      } else {
        if (!form.id.trim()) {
          setSubmitting(false);
          return setError("Product ID is required (e.g. \"sandals-ladies-new\").");
        }
        await createProduct({ ...payload, id: form.id.trim() });
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Changes save immediately to the backend."
              : "This creates a new product row in the database."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isEditing && (
            <div className="space-y-2">
              <Label>Product ID</Label>
              <Input
                value={form.id}
                onChange={(e) => update("id", e.target.value)}
                placeholder="sandals-ladies-new-style"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (KES)</Label>
              <Input
                type="number"
                min={1}
                value={form.priceKes}
                onChange={(e) => update("priceKes", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v as ApiProduct["category"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandals">Sandals</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                  <SelectItem value="hoodies">Hoodies</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Input
                value={form.subcategory}
                onChange={(e) => update("subcategory", e.target.value)}
                placeholder="Men / Ladies / Kids..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product photos</Label>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div key={img.src + i} className="relative">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="aspect-square w-full rounded-lg border border-border/60 object-cover"
                    />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => removeImage(i)}
                      className="absolute -right-1 -top-1 rounded-full bg-background p-0.5 shadow ring-1 ring-border"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {i === 0 ? (
                      <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 text-[10px] text-white">
                        Main
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makeMainImage(i)}
                        className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white"
                      >
                        Make main
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {cloudinaryConfigured ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesSelected}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CloudUpload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading..." : images.length ? "Add more photos" : "Upload photos"}
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  You can pick several photos at once. The first one is the main photo.
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Input
                    value={pastedUrl}
                    onChange={(e) => setPastedUrl(e.target.value)}
                    placeholder="https://... (photo link)"
                  />
                  <Button type="button" variant="outline" onClick={addPastedUrl} disabled={!pastedUrl.trim()}>
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Direct uploads need Cloudinary set up (see the README). Until then, paste photo links.
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Colors (comma-separated)</Label>
              <Input value={form.colors} onChange={(e) => update("colors", e.target.value)} placeholder="Black, Brown" />
            </div>
            <div className="space-y-2">
              <Label>Sizes (comma-separated)</Label>
              <Input value={form.sizes} onChange={(e) => update("sizes", e.target.value)} placeholder="38, 39, 40" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Materials</Label>
            <Textarea value={form.materials} onChange={(e) => update("materials", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Shipping note</Label>
            <Textarea value={form.shipping} onChange={(e) => update("shipping", e.target.value)} required />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEditing ? "Save changes" : "Create product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
