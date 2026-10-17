import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Ported from the frontend's src/data/products.ts. Image `src` values here
// are the original asset paths (e.g. from src/assets/afri/...) — swap these
// for real hosted URLs (S3, Cloudinary, /public, etc.) once images move
// off the frontend bundle and onto this API.
type SeedImage = { src: string; alt: string };
interface SeedProduct {
  id: string;
  title: string;
  priceKes: number;
  rating: number;
  category: "sandals" | "bags" | "hoodies";
  subcategory?: string;
  images: SeedImage[];
  colors: string[];
  sizes: (number | string)[];
  sizePricing?: Record<string, number>;
  patterns?: { id: string; label: string; images: SeedImage[] }[];
  description: string;
  materials: string;
  shipping: string;
  stock?: number;
}

const SHIPPING_NOTE = "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.";

const products: SeedProduct[] = [
  // SANDALS
  {
    id: "sandals-men-maasai",
    title: "Leather Sandal (Men)",
    priceKes: 2000,
    rating: 4.8,
    category: "sandals",
    subcategory: "Men",
    images: [
      { src: "/assets/afri/sandals-men-02-black.jpeg", alt: "Men leather sandal (black)" },
      { src: "/assets/afri/sandals-men-01-white.jpeg", alt: "Men leather sandal (white)" },
    ],
    colors: ["Black", "White"],
    sizes: [37, 38, 39, 40, 41, 42],
    description: "Handcrafted leather sandal with clean lines and cultural detailing — built for comfort and presence.",
    materials: "Premium leather upper, durable sole, hand-finished edges.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "sandals-men-buckle-1800",
    title: "Men Buckle Leather Sandal",
    priceKes: 1800,
    rating: 4.7,
    category: "sandals",
    subcategory: "Men",
    images: [{ src: "/assets/afri/sandals-men-03-buckle-1800.jpeg", alt: "Men buckle leather sandal" }],
    colors: ["Black"],
    sizes: [37, 38, 39, 40, 41, 42],
    description: "Classic buckle sandal — simple, strong, and comfortable for everyday wear.",
    materials: "Premium leather upper, durable sole.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "sandals-ladies-maasai",
    title: "Maasai Leather Sandal (Ladies)",
    priceKes: 2500,
    rating: 4.7,
    category: "sandals",
    subcategory: "Ladies",
    images: [{ src: "/assets/afri/sandal-brown.png", alt: "Maasai leather sandal for ladies" }],
    colors: ["Black", "Brown", "Tan"],
    sizes: [37, 38, 39, 40, 41, 42],
    description: "Elegant everyday sandal — easy to style and built to last.",
    materials: "Premium leather upper, durable sole.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "sandals-kids-classic",
    title: "Classic Leather Sandal (Kids)",
    priceKes: 1800,
    rating: 4.6,
    category: "sandals",
    subcategory: "Kids",
    images: [{ src: "/assets/afri/sandal-kids.png", alt: "Kids leather sandal" }],
    colors: ["Brown", "Tan", "Black"],
    sizes: [1],
    description: "Comfort-first kids sandal for everyday wear.",
    materials: "Soft leather upper, flexible sole.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "sandals-men-his-hers",
    title: "His & Hers Sandal (Men)",
    priceKes: 2000,
    rating: 4.8,
    category: "sandals",
    subcategory: "Men",
    images: [{ src: "/assets/afri/his-hers-sandal.jpeg", alt: "His & Hers sandal (unisex style)" }],
    colors: ["Brown", "Tan", "Black"],
    sizes: [37, 38, 39, 40, 41, 42],
    description: "His & Hers — the same clean unisex design, priced for Men and Ladies. Pair up and step out.",
    materials: "Premium leather upper, durable sole.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "sandals-ladies-his-hers",
    title: "His & Hers Sandal (Ladies)",
    priceKes: 1800,
    rating: 4.8,
    category: "sandals",
    subcategory: "Ladies",
    images: [{ src: "/assets/afri/his-hers-sandal.jpeg", alt: "His & Hers sandal (unisex style)" }],
    colors: ["Brown", "Tan", "Black"],
    sizes: [37, 38, 39, 40, 41, 42],
    description: "His & Hers — the same clean unisex design, priced for Men and Ladies. Pair up and step out.",
    materials: "Premium leather upper, durable sole.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "sandals-ladies-classic-1800",
    title: "Ladies Leather Sandal",
    priceKes: 1800,
    rating: 4.7,
    category: "sandals",
    subcategory: "Ladies",
    images: [
      { src: "/assets/afri/ladies-sandal-01.jpeg", alt: "Ladies leather sandal" },
      { src: "/assets/afri/ladies-sandal-02.jpeg", alt: "Ladies leather sandal" },
    ],
    colors: ["Brown", "Black", "Tan", "White"],
    sizes: [37, 38, 39, 40, 41, 42],
    description: "A clean everyday ladies sandal — easy to style, built for comfort, and made to last.",
    materials: "Premium leather upper, durable sole.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "sandals-ladies-strappy-1800",
    title: "Ladies Strappy Sandal",
    priceKes: 1800,
    rating: 4.7,
    category: "sandals",
    subcategory: "Ladies",
    images: [
      { src: "/assets/afri/ladies-sandal-03.jpeg", alt: "Ladies strappy sandal" },
      { src: "/assets/afri/ladies-sandal-04.jpeg", alt: "Ladies strappy sandal" },
    ],
    colors: ["Brown", "Black", "Tan", "White"],
    sizes: [37, 38, 39, 40, 41, 42],
    description: "A sleek strappy ladies sandal — lightweight feel with a clean premium finish.",
    materials: "Premium leather upper, durable sole.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "sandals-ladies-beaded-2000",
    title: "Ladies Beaded Anklet Sandal",
    priceKes: 2000,
    rating: 4.8,
    category: "sandals",
    subcategory: "Ladies",
    images: [{ src: "/assets/afri/ladies-sandal-05-beaded-2000.jpeg", alt: "Ladies beaded anklet sandal" }],
    colors: ["Black", "Brown"],
    sizes: [37, 38, 39, 40, 41, 42],
    description: "Statement beaded anklet sandal — handcrafted detail with a secure feel and premium finish.",
    materials: "Premium leather upper, durable sole, hand-beaded detailing.",
    shipping: SHIPPING_NOTE,
  },

  // BAGS
  {
    id: "bag-kids-brown",
    title: "Kids Backpack (Brown)",
    priceKes: 1700,
    rating: 4.7,
    category: "bags",
    subcategory: "Kids Bags",
    images: [{ src: "/assets/afri/kids-bag-01-brown.jpeg", alt: "Kids backpack (brown)" }],
    colors: ["Brown", "Tan"],
    sizes: [1],
    description: "Kids backpack for school and daily carry.",
    materials: "Durable faux leather, reinforced stitching.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "bag-kids-black",
    title: "Kids Backpack (Black)",
    priceKes: 1700,
    rating: 4.7,
    category: "bags",
    subcategory: "Kids Bags",
    images: [{ src: "/assets/afri/kids-bag-02-black.jpeg", alt: "Kids backpack (black)" }],
    colors: ["Black"],
    sizes: [1],
    description: "Kids backpack for school and daily carry.",
    materials: "Durable faux leather, reinforced stitching.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "bag-adult-backpack-black",
    title: "Adult Backpack (Black)",
    priceKes: 2700,
    rating: 4.7,
    category: "bags",
    subcategory: "Backpacks",
    images: [{ src: "/assets/afri/kids-bag-03-black-bottle.jpeg", alt: "Adult backpack (black)" }],
    colors: ["Black"],
    sizes: [1],
    description: "Adult backpack for work, travel, and daily carry.",
    materials: "Durable faux leather, reinforced stitching.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "bag-adult-backpack-brown",
    title: "Adult Backpack (Brown)",
    priceKes: 2700,
    rating: 4.7,
    category: "bags",
    subcategory: "Backpacks",
    images: [{ src: "/assets/afri/kids-bag-04-brown-set.jpeg", alt: "Adult backpack (brown)" }],
    colors: ["Brown", "Tan"],
    sizes: [1],
    description: "Adult backpack for work, travel, and daily carry.",
    materials: "Durable faux leather, reinforced stitching.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "bag-travel",
    title: "Travel Bag",
    priceKes: 3700,
    rating: 4.8,
    category: "bags",
    subcategory: "Travel Bags",
    images: [{ src: "/assets/afri/travel-bag-real.jpeg", alt: "Travel bag" }],
    colors: ["Black", "Brown"],
    sizes: [1],
    description: "Spacious duffel for trips — strong build, premium finish.",
    materials: "Leather body with textile panel, metal hardware.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "bag-lunch",
    title: "Lunch Bag",
    priceKes: 1500,
    rating: 4.6,
    category: "bags",
    subcategory: "Lunch Bag",
    images: [
      { src: "/assets/afri/lunch-bag-real-01.jpeg", alt: "Lunch bag on grass" },
      { src: "/assets/afri/lunch-bag-real-02.jpeg", alt: "Lunch bag worn crossbody" },
    ],
    colors: ["Brown"],
    sizes: [1],
    description: "Compact lunch bag with shoulder strap — easy carry and everyday use.",
    materials: "Insulated lining, easy-clean interior.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "bag-wash",
    title: "Wash Bag",
    priceKes: 1500,
    rating: 4.6,
    category: "bags",
    subcategory: "Wash Bag",
    images: [{ src: "/assets/afri/wash-bag-real.jpeg", alt: "Wash bag" }],
    colors: ["Black", "Brown"],
    sizes: [1],
    description: "Premium toiletry bag for travel — compact but spacious.",
    materials: "Leather + water-resistant inner lining.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "bag-kiondo-sling-handbags",
    title: "Weave Kiondo Sling Handbag",
    priceKes: 1000,
    rating: 4.8,
    category: "bags",
    subcategory: "Weave Kiondo Sling Handbags",
    images: [{ src: "/assets/afri/kiondo-01.jpeg", alt: "Weave kiondo sling handbag" }],
    patterns: [
      { id: "kiondo-1", label: "Pattern 1", images: [{ src: "/assets/afri/kiondo-01.jpeg", alt: "Kiondo pattern 1" }] },
      { id: "kiondo-2", label: "Pattern 2", images: [{ src: "/assets/afri/kiondo-02.jpeg", alt: "Kiondo pattern 2" }] },
      { id: "kiondo-3", label: "Pattern 3", images: [{ src: "/assets/afri/kiondo-03.jpeg", alt: "Kiondo pattern 3" }] },
      { id: "kiondo-4", label: "Pattern 4", images: [{ src: "/assets/afri/kiondo-04.jpeg", alt: "Kiondo pattern 4" }] },
      { id: "kiondo-5", label: "Pattern 5", images: [{ src: "/assets/afri/kiondo-05.jpeg", alt: "Kiondo pattern 5" }] },
      { id: "kiondo-6", label: "Pattern 6", images: [{ src: "/assets/afri/kiondo-06.jpeg", alt: "Kiondo pattern 6" }] },
      { id: "kiondo-7", label: "Pattern 7", images: [{ src: "/assets/afri/kiondo-07.jpeg", alt: "Kiondo pattern 7" }] },
    ],
    sizes: ["6 by 6 inches", "8 by 8 inches", "10 by 10 inches", "12 by 12 inches", "14 by 14 inches"],
    sizePricing: {
      "6 by 6 inches": 1000,
      "8 by 8 inches": 1200,
      "10 by 10 inches": 1600,
      "12 by 12 inches": 2000,
      "14 by 14 inches": 2500,
    },
    colors: ["Assorted"],
    description: "Handwoven kiondo sling handbag — choose your size and design pattern.",
    materials: "Handwoven fiber with leather straps.",
    shipping: SHIPPING_NOTE,
  },
  {
    id: "bundle-african-summer-wear",
    title: "African Wear Set (Hat + Bag + Sandals)",
    priceKes: 2800,
    rating: 4.8,
    category: "bags",
    subcategory: "African Wear",
    images: [
      { src: "/assets/afri/african-wear-01.jpeg", alt: "African wear set (red plaid)" },
      { src: "/assets/afri/african-wear-02.jpeg", alt: "African wear set (kente)" },
      { src: "/assets/afri/african-wear-03.jpeg", alt: "African wear set (floral)" },
      { src: "/assets/afri/african-wear-04.jpeg", alt: "African wear set (kente close-up)" },
    ],
    colors: ["Assorted"],
    sizes: [37, 38, 39, 40, 41, 42],
    description: "Complete summer set: hat + bag + sandals. Select your sandal size, then confirm details on WhatsApp.",
    materials: "Mixed materials (woven + leather details).",
    shipping: SHIPPING_NOTE,
  },

  // HOODIES
  {
    id: "hoodie-classic",
    title: "AFRI Sandies Hoodie",
    priceKes: 3500,
    rating: 4.7,
    category: "hoodies",
    subcategory: "Hoodies",
    images: [
      { src: "/assets/afri/hoodies-grid-1.jpeg", alt: "Hoodies color options" },
      { src: "/assets/afri/hoodies-grid-2.jpeg", alt: "Hoodies color options" },
      { src: "/assets/afri/hoodies-grid-3.jpeg", alt: "Hoodies color options" },
    ],
    colors: ["Black", "Red", "Green", "Pink", "Grey", "White", "Blue"],
    sizes: [1],
    description: "Premium hoodie with AFRI Sandies branding. Choose your color, then share your size on WhatsApp during checkout.",
    materials: "Soft fleece cotton blend.",
    shipping: SHIPPING_NOTE,
  },
];

async function main() {
  console.log(`Seeding ${products.length} products...`);
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        title: p.title,
        priceKes: p.priceKes,
        rating: p.rating,
        category: p.category,
        subcategory: p.subcategory,
        stock: p.stock ?? 50,
        images: JSON.stringify(p.images),
        colors: JSON.stringify(p.colors),
        sizes: JSON.stringify(p.sizes),
        sizePricing: p.sizePricing ? JSON.stringify(p.sizePricing) : null,
        patterns: p.patterns ? JSON.stringify(p.patterns) : null,
        description: p.description,
        materials: p.materials,
        shipping: p.shipping,
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@afrisandies.co.ke";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-please";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash, name: "AFRI SANDIES Admin" },
  });

  console.log(`Admin user ready: ${adminEmail}`);
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
