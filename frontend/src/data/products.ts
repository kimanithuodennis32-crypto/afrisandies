import sandalBrown from "@/assets/afri/sandal-brown.png";
import sandalKids from "@/assets/afri/sandal-kids.png";

import africanWear01 from "@/assets/afri/african-wear/african-wear-01.jpeg";
import africanWear02 from "@/assets/afri/african-wear/african-wear-02.jpeg";
import africanWear03 from "@/assets/afri/african-wear/african-wear-03.jpeg";
import africanWear04 from "@/assets/afri/african-wear/african-wear-04.jpeg";

import mensSandalWhite from "@/assets/afri/sandals-men-01-white.jpeg";
import mensSandalBlack from "@/assets/afri/sandals-men-02-black.jpeg";
import mensSandalBuckle1800 from "@/assets/afri/sandals-men-03-buckle-1800.jpeg";
import hisHersSandal from "@/assets/afri/his-hers-sandal.jpeg";

import kiondo01 from "@/assets/afri/kiondo/kiondo-01.jpeg";
import kiondo02 from "@/assets/afri/kiondo/kiondo-02.jpeg";
import kiondo03 from "@/assets/afri/kiondo/kiondo-03.jpeg";
import kiondo04 from "@/assets/afri/kiondo/kiondo-04.jpeg";
import kiondo05 from "@/assets/afri/kiondo/kiondo-05.jpeg";
import kiondo06 from "@/assets/afri/kiondo/kiondo-06.jpeg";
import kiondo07 from "@/assets/afri/kiondo/kiondo-07.jpeg";
import ladiesSandal01 from "@/assets/afri/ladies-sandals/ladies-sandal-01.jpeg";
import ladiesSandal02 from "@/assets/afri/ladies-sandals/ladies-sandal-02.jpeg";
import ladiesSandal03 from "@/assets/afri/ladies-sandals/ladies-sandal-03.jpeg";
import ladiesSandal04 from "@/assets/afri/ladies-sandals/ladies-sandal-04.jpeg";
import ladiesSandal05 from "@/assets/afri/ladies-sandals/ladies-sandal-05-beaded-2000.jpeg";

import travelBag from "@/assets/afri/travel-bag-real.jpeg";
import lunchBagReal01 from "@/assets/afri/lunch-bag-real-01.jpeg";
import lunchBagReal02 from "@/assets/afri/lunch-bag-real-02.jpeg";
import washBag from "@/assets/afri/wash-bag-real.jpeg";

import hoodieGrid1 from "@/assets/afri/hoodies/hoodies-grid-1.jpeg";
import hoodieGrid2 from "@/assets/afri/hoodies/hoodies-grid-2.jpeg";
import hoodieGrid3 from "@/assets/afri/hoodies/hoodies-grid-3.jpeg";

import kidsBagBrown from "@/assets/afri/kids-bags/kids-bag-01-brown.jpeg";
import kidsBagBlack from "@/assets/afri/kids-bags/kids-bag-02-black.jpeg";
import kidsBagBlackBottle from "@/assets/afri/kids-bags/kids-bag-03-black-bottle.jpeg";
import kidsBagBrownSet from "@/assets/afri/kids-bags/kids-bag-04-brown-set.jpeg";

import type { Product } from "@/data/types";

export const products: Product[] = [
  // SANDALS
  {
    id: "sandals-men-maasai",
    title: "Leather Sandal (Men)",
    priceKes: 2000,
    rating: 4.8,
    category: "sandals",
    subcategory: "Men",
    images: [
      { src: mensSandalBlack, alt: "Men leather sandal (black)" },
      { src: mensSandalWhite, alt: "Men leather sandal (white)" },
    ],
    colors: ["Black", "White"],
    sizes: [37, 38, 39, 40, 41, 42],
    description:
      "Handcrafted leather sandal with clean lines and cultural detailing — built for comfort and presence.",
    materials: "Premium leather upper, durable sole, hand-finished edges.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "sandals-men-buckle-1800",
    title: "Men Buckle Leather Sandal",
    priceKes: 1800,
    rating: 4.7,
    category: "sandals",
    subcategory: "Men",
    images: [{ src: mensSandalBuckle1800, alt: "Men buckle leather sandal" }],
    colors: ["Black"],
    sizes: [37, 38, 39, 40, 41, 42],
    description:
      "Classic buckle sandal — simple, strong, and comfortable for everyday wear.",
    materials: "Premium leather upper, durable sole.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "sandals-ladies-maasai",
    title: "Maasai Leather Sandal (Ladies)",
    priceKes: 2500,
    rating: 4.7,
    category: "sandals",
    subcategory: "Ladies",
    images: [{ src: sandalBrown, alt: "Maasai leather sandal for ladies" }],
    colors: ["Black", "Brown", "Tan"],
    sizes: [37, 38, 39, 40, 41, 42],
    description: "Elegant everyday sandal — easy to style and built to last.",
    materials: "Premium leather upper, durable sole.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "sandals-kids-classic",
    title: "Classic Leather Sandal (Kids)",
    priceKes: 1800,
    rating: 4.6,
    category: "sandals",
    subcategory: "Kids",
    images: [{ src: sandalKids, alt: "Kids leather sandal" }],
    colors: ["Brown", "Tan", "Black"],
    sizes: [1],
    description: "Comfort-first kids sandal for everyday wear.",
    materials: "Soft leather upper, flexible sole.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "sandals-men-his-hers",
    title: "His & Hers Sandal (Men)",
    priceKes: 2000,
    rating: 4.8,
    category: "sandals",
    subcategory: "Men",
    images: [{ src: hisHersSandal, alt: "His & Hers sandal (unisex style)" }],
    colors: ["Brown", "Tan", "Black"],
    sizes: [37, 38, 39, 40, 41, 42],
    description:
      "His & Hers — the same clean unisex design, priced for Men and Ladies. Pair up and step out.",
    materials: "Premium leather upper, durable sole.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "sandals-ladies-his-hers",
    title: "His & Hers Sandal (Ladies)",
    priceKes: 1800,
    rating: 4.8,
    category: "sandals",
    subcategory: "Ladies",
    images: [{ src: hisHersSandal, alt: "His & Hers sandal (unisex style)" }],
    colors: ["Brown", "Tan", "Black"],
    sizes: [37, 38, 39, 40, 41, 42],
    description:
      "His & Hers — the same clean unisex design, priced for Men and Ladies. Pair up and step out.",
    materials: "Premium leather upper, durable sole.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "sandals-ladies-classic-1800",
    title: "Ladies Leather Sandal",
    priceKes: 1800,
    rating: 4.7,
    category: "sandals",
    subcategory: "Ladies",
    images: [
      { src: ladiesSandal01, alt: "Ladies leather sandal" },
      { src: ladiesSandal02, alt: "Ladies leather sandal" },
    ],
    colors: ["Brown", "Black", "Tan", "White"],
    sizes: [37, 38, 39, 40, 41, 42],
    description:
      "A clean everyday ladies sandal — easy to style, built for comfort, and made to last.",
    materials: "Premium leather upper, durable sole.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "sandals-ladies-strappy-1800",
    title: "Ladies Strappy Sandal",
    priceKes: 1800,
    rating: 4.7,
    category: "sandals",
    subcategory: "Ladies",
    images: [
      { src: ladiesSandal03, alt: "Ladies strappy sandal" },
      { src: ladiesSandal04, alt: "Ladies strappy sandal" },
    ],
    colors: ["Brown", "Black", "Tan", "White"],
    sizes: [37, 38, 39, 40, 41, 42],
    description:
      "A sleek strappy ladies sandal — lightweight feel with a clean premium finish.",
    materials: "Premium leather upper, durable sole.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "sandals-ladies-beaded-2000",
    title: "Ladies Beaded Anklet Sandal",
    priceKes: 2000,
    rating: 4.8,
    category: "sandals",
    subcategory: "Ladies",
    images: [{ src: ladiesSandal05, alt: "Ladies beaded anklet sandal" }],
    colors: ["Black", "Brown"],
    sizes: [37, 38, 39, 40, 41, 42],
    description:
      "Statement beaded anklet sandal — handcrafted detail with a secure feel and premium finish.",
    materials: "Premium leather upper, durable sole, hand-beaded detailing.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },

  // BAGS
  {
    id: "bag-kids-brown",
    title: "Kids Backpack (Brown)",
    priceKes: 1700,
    rating: 4.7,
    category: "bags",
    subcategory: "Kids Bags",
    images: [{ src: kidsBagBrown, alt: "Kids backpack (brown)" }],
    colors: ["Brown", "Tan"],
    sizes: [1],
    description: "Kids backpack for school and daily carry.",
    materials: "Durable faux leather, reinforced stitching.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "bag-kids-black",
    title: "Kids Backpack (Black)",
    priceKes: 1700,
    rating: 4.7,
    category: "bags",
    subcategory: "Kids Bags",
    images: [{ src: kidsBagBlack, alt: "Kids backpack (black)" }],
    colors: ["Black"],
    sizes: [1],
    description: "Kids backpack for school and daily carry.",
    materials: "Durable faux leather, reinforced stitching.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "bag-adult-backpack-black",
    title: "Adult Backpack (Black)",
    priceKes: 2700,
    rating: 4.7,
    category: "bags",
    subcategory: "Backpacks",
    images: [{ src: kidsBagBlackBottle, alt: "Adult backpack (black)" }],
    colors: ["Black"],
    sizes: [1],
    description: "Adult backpack for work, travel, and daily carry.",
    materials: "Durable faux leather, reinforced stitching.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "bag-adult-backpack-brown",
    title: "Adult Backpack (Brown)",
    priceKes: 2700,
    rating: 4.7,
    category: "bags",
    subcategory: "Backpacks",
    images: [{ src: kidsBagBrownSet, alt: "Adult backpack (brown)" }],
    colors: ["Brown", "Tan"],
    sizes: [1],
    description: "Adult backpack for work, travel, and daily carry.",
    materials: "Durable faux leather, reinforced stitching.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },

  {
    id: "bag-travel",
    title: "Travel Bag",
    priceKes: 3700,
    rating: 4.8,
    category: "bags",
    subcategory: "Travel Bags",
    images: [{ src: travelBag, alt: "Travel bag" }],
    colors: ["Black", "Brown"],
    sizes: [1],
    description: "Spacious duffel for trips — strong build, premium finish.",
    materials: "Leather body with textile panel, metal hardware.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "bag-lunch",
    title: "Lunch Bag",
    priceKes: 1500,
    rating: 4.6,
    category: "bags",
    subcategory: "Lunch Bag",
    images: [
      { src: lunchBagReal01, alt: "Lunch bag on grass" },
      { src: lunchBagReal02, alt: "Lunch bag worn crossbody" },
    ],
    colors: ["Brown"],
    sizes: [1],
    description: "Compact lunch bag with shoulder strap — easy carry and everyday use.",
    materials: "Insulated lining, easy-clean interior.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "bag-wash",
    title: "Wash Bag",
    priceKes: 1500,
    rating: 4.6,
    category: "bags",
    subcategory: "Wash Bag",
    images: [{ src: washBag, alt: "Wash bag" }],
    colors: ["Black", "Brown"],
    sizes: [1],
    description: "Premium toiletry bag for travel — compact but spacious.",
    materials: "Leather + water-resistant inner lining.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "bag-kiondo-sling-handbags",
    title: "Weave Kiondo Sling Handbag",
    priceKes: 1000,
    rating: 4.8,
    category: "bags",
    subcategory: "Weave Kiondo Sling Handbags",
    images: [{ src: kiondo01, alt: "Weave kiondo sling handbag" }],
    patterns: [
      { id: "kiondo-1", label: "Pattern 1", images: [{ src: kiondo01, alt: "Kiondo pattern 1" }] },
      { id: "kiondo-2", label: "Pattern 2", images: [{ src: kiondo02, alt: "Kiondo pattern 2" }] },
      { id: "kiondo-3", label: "Pattern 3", images: [{ src: kiondo03, alt: "Kiondo pattern 3" }] },
      { id: "kiondo-4", label: "Pattern 4", images: [{ src: kiondo04, alt: "Kiondo pattern 4" }] },
      { id: "kiondo-5", label: "Pattern 5", images: [{ src: kiondo05, alt: "Kiondo pattern 5" }] },
      { id: "kiondo-6", label: "Pattern 6", images: [{ src: kiondo06, alt: "Kiondo pattern 6" }] },
      { id: "kiondo-7", label: "Pattern 7", images: [{ src: kiondo07, alt: "Kiondo pattern 7" }] },
    ],
    sizes: [
      "6 by 6 inches",
      "8 by 8 inches",
      "10 by 10 inches",
      "12 by 12 inches",
      "14 by 14 inches",
    ],
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
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
  {
    id: "bundle-african-summer-wear",
    title: "African Wear Set (Hat + Bag + Sandals)",
    priceKes: 2800,
    rating: 4.8,
    category: "bags",
    subcategory: "African Wear",
    images: [
      { src: africanWear01, alt: "African wear set (red plaid)" },
      { src: africanWear02, alt: "African wear set (kente)" },
      { src: africanWear03, alt: "African wear set (floral)" },
      { src: africanWear04, alt: "African wear set (kente close-up)" },
    ],
    colors: ["Assorted"],
    sizes: [37, 38, 39, 40, 41, 42],
    description:
      "Complete summer set: hat + bag + sandals. Select your sandal size, then confirm details on WhatsApp.",
    materials: "Mixed materials (woven + leather details).",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
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
      { src: hoodieGrid1, alt: "Hoodies color options" },
      { src: hoodieGrid2, alt: "Hoodies color options" },
      { src: hoodieGrid3, alt: "Hoodies color options" },
    ],
    colors: ["Black", "Red", "Green", "Pink", "Grey", "White", "Blue"],
    sizes: [1],
    description:
      "Premium hoodie with AFRI Sandies branding. Choose your color, then share your size on WhatsApp during checkout.",
    materials: "Soft fleece cotton blend.",
    shipping: "Nairobi & upcountry: 2–4 days. Delivery fee KES 300.",
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function getProductsBySlug(slug: string) {
  // Bags
  if (slug === "bags") return products.filter((p) => p.category === "bags");
  if (slug === "backpacks") return products.filter((p) => p.category === "bags" && p.subcategory === "Backpacks");
  if (slug === "kiondo-sling-handbags")
    return products.filter((p) => p.category === "bags" && p.subcategory === "Weave Kiondo Sling Handbags");
  if (slug === "african-summer-wear")
    return products.filter((p) => p.category === "bags" && p.subcategory === "African Wear");
  if (slug === "travel-bags") return products.filter((p) => p.category === "bags" && p.subcategory === "Travel Bags");
  if (slug === "lunch-bag") return products.filter((p) => p.category === "bags" && p.subcategory === "Lunch Bag");
  if (slug === "wash-bag") return products.filter((p) => p.category === "bags" && p.subcategory === "Wash Bag");
  if (slug === "kids-bags") return products.filter((p) => p.category === "bags" && p.subcategory === "Kids Bags");

  // Sandals
  if (slug === "sandals") return products.filter((p) => p.category === "sandals");
  if (slug === "sandals-men") return products.filter((p) => p.category === "sandals" && p.subcategory === "Men");
  if (slug === "sandals-ladies") return products.filter((p) => p.category === "sandals" && p.subcategory === "Ladies");
  if (slug === "sandals-kids") return products.filter((p) => p.category === "sandals" && p.subcategory === "Kids");

  // Hoodies
  if (slug === "hoodies") return products.filter((p) => p.category === "hoodies");

  return products;
}
