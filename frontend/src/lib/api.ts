// In production the API is served from the same domain as the site, so the
// base is empty (relative URLs). In local dev it defaults to the API on :4000.
// Set VITE_API_URL only if you host the API on a different domain.
const API_BASE: string =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4000" : "");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---- Orders ----

export interface CreateOrderLine {
  productId: string;
  qty: number;
  size?: string | number;
  color?: string;
  pattern?: string;
}

export interface CreateOrderInput {
  name: string;
  phone: string;
  county?: string;
  town?: string;
  address?: string;
  delivery: "home" | "pickup";
  lines: CreateOrderLine[];
}

export interface CreateOrderResult {
  order: {
    id: string;
    orderCode: string;
    subtotalKes: number;
    shippingKes: number;
    totalKes: number;
    status: string;
  };
  whatsappUrl: string;
}

export function createOrder(input: CreateOrderInput) {
  return request<CreateOrderResult>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ---- Admin auth ----

const ADMIN_TOKEN_KEY = "afri-sandies.admin-token";

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function adminLogin(email: string, password: string) {
  return request<{ token: string; admin: { id: string; email: string; name: string } }>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

function authHeaders(): HeadersInit {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---- Admin stats ----

export interface AdminStats {
  totalSalesKes: number;
  ordersToday: number;
  productsCount: number;
  customersCount: number;
}

export function getAdminStats() {
  return request<AdminStats>("/api/admin/stats", { headers: authHeaders() });
}

// ---- Orders (admin) ----

export interface AdminOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  totalKes: number;
  status: string;
  createdAt: string;
}

export function listOrders(params: { limit?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  return request<{ orders: AdminOrder[]; total: number }>(`/api/orders?${qs.toString()}`, {
    headers: authHeaders(),
  });
}

// ---- Products (admin) ----

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ApiProduct {
  id: string;
  title: string;
  priceKes: number;
  rating: number;
  category: "sandals" | "bags" | "hoodies";
  subcategory?: string;
  stock: number;
  images: ProductImage[];
  colors: string[];
  sizes: (number | string)[];
  sizePricing?: Record<string, number>;
  description: string;
  materials: string;
  shipping: string;
}

// Fields the Admin form collects; id is required on create, omitted on update.
export type ProductInput = Omit<ApiProduct, "id"> & { id?: string };

export function listProducts() {
  return request<ApiProduct[]>("/api/products");
}

export function createProduct(input: ProductInput) {
  return request<ApiProduct>("/api/products", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export function updateProduct(id: string, input: Partial<ProductInput>) {
  return request<ApiProduct>(`/api/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export function deleteProduct(id: string) {
  return request<void>(`/api/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

// ---- Gallery ----

export type GalleryCategory = "event" | "customer" | "other";

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: GalleryCategory;
  createdAt: string;
}

export function listGallery() {
  return request<GalleryItem[]>("/api/gallery");
}

export function createGalleryItem(input: { imageUrl: string; caption: string; category: GalleryCategory }) {
  return request<GalleryItem>("/api/gallery", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export function updateGalleryItem(id: string, input: { caption?: string; category?: GalleryCategory }) {
  return request<GalleryItem>(`/api/gallery/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
}

export function deleteGalleryItem(id: string) {
  return request<void>(`/api/gallery/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
