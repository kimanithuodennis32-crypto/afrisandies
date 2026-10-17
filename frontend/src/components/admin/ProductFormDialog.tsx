import { useEffect, useRef, useState } from "react";
import { CloudUpload } from "lucide-react";

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
  imageSrc: "",
  imageAlt: "",
  colors: "",
  sizes: "",
  description: "",
  materials: "",
  shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
};

export default function ProductFormDialog({ open, onOpenChange, product, onSaved }: ProductFormDialogProps) {
  const [form, setForm] = useState(emptyForm);
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
        imageSrc: product.images[0]?.src ?? "",
        imageAlt: product.images[0]?.alt ?? "",
        colors: product.colors.join(", "),
        sizes: product.sizes.join(", "),
        description: product.description,
        materials: product.materials,
        shipping: product.shipping,
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [open, product]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      update("imageSrc", url);
      if (!form.imageAlt.trim()) update("imageAlt", form.title.trim() || file.name);
    } catch (err) {
      setError(err instanceof CloudinaryUploadError ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const priceKes = Number(form.priceKes);
    const rating = Number(form.rating);
    const stock = Number(form.stock);
    if (!Number.isFinite(priceKes) || priceKes <= 0) return setError("Price must be a positive number.");
    if (!form.imageSrc.trim() || !form.imageAlt.trim()) return setError("Image src and alt text are required.");

    const payload: ProductInput = {
      title: form.title.trim(),
      priceKes,
      rating: Number.isFinite(rating) ? rating : 4.5,
      category: form.category,
      subcategory: form.subcategory.trim() || undefined,
      stock: Number.isFinite(stock) ? stock : 0,
      images: [{ src: form.imageSrc.trim(), alt: form.imageAlt.trim() }],
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
            <Label>Product image</Label>
            {cloudinaryConfigured ? (
              <div className="flex items-center gap-3">
                {form.imageSrc && (
                  <img
                    src={form.imageSrc}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg border border-border/60 object-cover"
                  />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelected}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CloudUpload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading..." : form.imageSrc ? "Replace image" : "Upload image"}
                </Button>
              </div>
            ) : (
              <>
                <Input
                  value={form.imageSrc}
                  onChange={(e) => update("imageSrc", e.target.value)}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                  Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env to upload directly
                  instead of pasting a URL.
                </p>
              </>
            )}
          </div>
          <div className="space-y-2">
            <Label>Image alt text</Label>
            <Input value={form.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} />
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
