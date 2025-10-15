// Simple data layer JS (pas de TS).


import PhotoShopDragstick from '../assets/baton/drastick.png';
import PhotoShopFantastick from '../assets/baton/fantastick.png';
import PhotoShopWoodstick from '../assets/baton/woodstick.png';


import Photo1ShopDragstick from '../assets/products/drastick/1.jpg';
import Photo2ShopDragstick from '../assets/products/drastick/2.jpg';
import Photo3ShopDragstick from '../assets/products/drastick/3.jpg';

import Photo1ShopFantastick from '../assets/products/fantastic/1.jpg';
import Photo2ShopFantastick from '../assets/products/fantastic/2.jpg';
import Photo3ShopFantastick from '../assets/products/fantastic/3.jpg';

import Photo1ShopWoodstick from '../assets/products/woodstick/1.jpg';
import Photo2ShopWoodstick from '../assets/products/woodstick/2.jpg';
import Photo3ShopWoodstick from '../assets/products/woodstick/3.jpg';

// Product database (could be fetched from a CMS or database in a real app).
// For simplicity, we define it here directly.
// Images are statically imported above for Next.js optimization.
// Each product has an id, name, price, description, images, and specs.
// The `isActive` flag can be used to hide products from the shop without deleting them.
// The `options` field can hold product variations like sizes or extras.
// The `stripe` field holds Stripe price IDs for payment integration.
// The `alt` field is for image alt text for accessibility and SEO.


export const PRODUCTS = [
  {
    id: 'drastick',
    slug: 'drastick',
    name: 'Le Drastick',
    priceEUR: 49.9,
    photo_shop: PhotoShopDragstick,
    desc_shop : '“Sans compromis”',
    alt: "Bâtons de ski Drastick",

    images: [
      Photo1ShopDragstick,
      Photo2ShopDragstick,
      Photo3ShopDragstick,
    ],
    description:
      "Le Drastick est connu pour sa simplicité et sa légèreté. Sans dragonne, il suit partout : freeride, freestyle, piste.",
    specs: [
      { label: 'Poids', value: '217 g / 7,54 oz' },
      { label: 'Taille', value: '127 cm / 50"' },
      { label: 'Matériau', value: 'ALU 5083 — Ø18 mm' },
      { label: 'Grip', value: '01/11' },
      { label: 'Strap', value: '—' },
      { label: 'Panier', value: '03/27 — S.S. Power' },
      { label: 'Pointe', value: '05/1 + 08/2 — Easy Fit + Ice' },
    ],
    options: { sizes: ['127 cm'], extras: [{ id: 'rescue', label: 'Bâton de secours', priceEUR: 20 }] },
    stripe: { priceId: 'price_DRAXXXXX' },
    isActive: true,
  },
  {
    id: 'fantastic',
    slug: 'fantastic',
    name: 'Le Fantastic',
    priceEUR: 79.9,
    photo_shop: PhotoShopFantastick,
    desc_shop : '“Le passe-partout”',
    alt: "Bâtons de ski Fantastic",

    images: [
      Photo1ShopFantastick,
      Photo2ShopFantastick,
      Photo3ShopFantastick,
    ],
    description: 'Bâton télescopique 100–140 cm, robuste et polyvalent pour le touring.',
    specs: [
      { label: 'Poids', value: '306 g / 10,79 oz' },
      { label: 'Taille', value: '100–140 cm / 40"–56"' },
      { label: 'Matériau', value: 'ALU 7075-T6 — Ø18/16 mm' },
      { label: 'Grip', value: '01/28 + 01/56 — Ergo Lite + Foam Touring' },
      { label: 'Strap', value: '02/36 — Comfort Automatic' },
      { label: 'Panier', value: '03/27-F — S.S. Power' },
      { label: 'Pointe', value: '05/5 + 08/15 — Multi Fit + Carbide' },
    ],
    options: { sizes: ['100–140 cm'] },
    stripe: { priceId: 'price_FANTXXXX' },
    isActive: true,
  },
  {
    id: 'woodstick',
    slug: 'woodstick',
    name: 'Le Wood Stick',
    priceEUR: 119.99,
    photo_shop: PhotoShopWoodstick,
    desc_shop : '“Au naturel”',
    alt: "Bâtons de ski Woodstick",

    images: [
      Photo1ShopWoodstick,
      Photo2ShopWoodstick,
      Photo3ShopWoodstick,
    ],
    description: 'Bâton artisanal en bois, fabriqué en France par William.',
    specs: [
      { label: 'Poids', value: '—' },
      { label: 'Taille', value: 'Taille unique' },
      { label: 'Matériau', value: 'Bois de Châtaignier' },
    ],
    options: { sizes: ['110 cm', '115 cm', '120 cm', '125 cm', '130 cm', '135 cm'] },
    stripe: { priceId: 'price_WOODXXXX' },
    isActive: true,
  },
];

export const getAllProducts = () => PRODUCTS.filter(p => p.isActive);
export const getProductBySlug = (slug) =>
  PRODUCTS.find(p => p.slug === slug && p.isActive) || null;