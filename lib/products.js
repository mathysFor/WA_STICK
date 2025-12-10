// Simple data layer JS (pas de TS).


import PhotoShopDragstick from '../assets/products/drastick/1.jpg';
import PhotoShopFantastick from '../assets/products/fantastic/1.jpg';
import PhotoShopWoodstick from '../assets/products/woodstick/1.jpg';


import Photo1ShopDragstick from '../assets/products/drastick/1.jpg';
import Photo2ShopDragstick from '../assets/products/drastick/2.jpg';
import Photo3ShopDragstick from '../assets/products/drastick/3.jpg';
import Photo4ShopDragstick from '../assets/products/drastick/4.jpg';


import Photo1ShopFantastick from '../assets/products/fantastic/1.jpg';
import Photo2ShopFantastick from '../assets/products/fantastic/2.jpg';
import Photo3ShopFantastick from '../assets/products/fantastic/3.jpg';
import Photo4ShopFantastick from '../assets/products/fantastic/4.jpg';

import Photo1ShopWoodstick from '../assets/products/woodstick/1.jpg';
import Photo2ShopWoodstick from '../assets/products/woodstick/2.jpg';
import Photo3ShopWoodstick from '../assets/products/woodstick/3.jpg';
import Photo4ShopWoodstick from '../assets/products/woodstick/4.jpg';

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
    priceEUR: 59.70,
    photo_shop: PhotoShopDragstick,
    desc_shop : '“Sans compromis”',
    alt: "Bâtons de ski Drastick",
    stripePriceId : "price_1SV9DeRSqCge6S7JMA7NYC2r",

    images: [
      Photo1ShopDragstick,
      Photo2ShopDragstick,
      Photo3ShopDragstick,
      Photo4ShopDragstick,
    ],
    description:
      "Modèle favori de Micka, ce bâton ne fait aucun compromis avec son rose pétant, idéal pour provoquer les regards sur le télésiège ou simplement pour le retrouver facilement. Profitez de la poignée qui vous offrira la meilleure prise en main. La dragonne est déjà détachée pour ne pas vous gêner lors du déclenchement de votre sac ABS (Micka ne vous le souhaite pas). Sans oublier une rondelle large, parfaite pour la poudreuse, et un tube en aluminium léger et résistant qui saura se remettre en place (plus ou moins) avec vos biscotos si vraiment vous avez abusé !",
    specs: [
      { label: 'Poids', value: '217 g' },
      { label: 'Taille', value: '127 cm' },
      { label: 'Matériel', value: 'Aluminium (5083, ø18 mm)' },
      { label: 'Dragonne', value: 'Sans' },
      { label: 'Rondelle', value: 'Large' },
      { label: 'Pointe', value: 'carbure de tungstène' },
    ],
    options: { sizes: ['127 cm'], extras: [{ id: 'rescue', label: 'Bâton de secours', priceEUR: 20,stripePriceId: "price_1SVBsiRSqCge6S7JZZKNm5TZ" }] },
    isActive: true,
  },
  {
    id: 'fantastic',
    slug: 'fantastic',
    name: 'Le Fantastic',
    priceEUR: 109.70,
    photo_shop: PhotoShopFantastick,
    desc_shop : '“Le passe-partout”',
    alt: "Bâtons de ski Fantastic",
    stripePriceId : "price_1SV9FSRSqCge6S7JovkK1dSu",
    images: [
      Photo1ShopFantastick,
      Photo2ShopFantastick,
      Photo3ShopFantastick,
      Photo4ShopFantastick,
    ],
    description: 'Le modèle qui met tout le monde d’accord, surtout notre Mathys et Julie ! Ce n’est pas un hasard : avec sa poignée longue, parfaitement adaptée à toutes les pratiques de la montagne, et son format télescopique qui s’ajuste à toutes les tailles, vous tenez là vos deux meilleurs compagnons pour vos plus belles sessions. Et cerise sur le gâteau : une dragonne amovible, à retirer pour plus de sécurité lors de vos sorties freeride !',
    specs: [
      { label: 'Poids', value: '306 g' },
      { label: 'Taille', value: '100–140 cm' },
      { label: 'Matériel', value: 'ALU T6 Ø18/16 mm' },
      { label: 'Grip', value: 'Ergonomique, 180mm' },
      { label: 'Dragonne', value: 'Clipsable, Réglage automatique' },
      { label: 'Rondelle', value: 'Freeride 90mm ultra résistante' },
      { label: 'Pointe', value: 'Carbure de Tungstène' },
    ],
    options: { sizes: ['100–140 cm'] },
    stripe: { priceId: 'price_FANTXXXX' },
    isActive: true,
  },
  {
    id: 'woodstick',
    slug: 'woodstick',
    name: 'Le Wood Stick',
    priceEUR: 124.70,
    photo_shop: PhotoShopWoodstick,
    desc_shop : '“Au naturel”',
    alt: "Bâtons de ski Woodstick",
     directCheckoutUrl: "https://buy.stripe.com/TON_PAYMENT_LINK",

    images: [
      Photo1ShopWoodstick,
      Photo2ShopWoodstick,
      Photo3ShopWoodstick,
      Photo4ShopWoodstick,
    ],
    description: 'Modèle favori de William, l’un des premiers membres de Winteractivity, et réalisé de manière artisanale par ses soins. Confectionné à partir de matériaux locaux et durables, il perpétue un savoir-faire traditionnel dans le respect de l’environnement. Un bâton conçu pour celles et ceux sensibles à une démarche authentique et pleine de sens. Produits artisanaux fait à la main pouvant présenter des imperfections',
    specs: [
      { label: 'Taille', value: 'Selon le choix sélectionné' },
      { label: 'Poids', value: 'Selon la taille' }, 
      { label: 'Matériel', value: 'Châtaignier de Savoie' },
      { label: 'Dragonne', value: 'Sans' },
      { label: 'Rondelle', value: 'Large en aluminium by Plum' },
      { label: 'Pointe', value: 'Tungstène et aluminium' },

    ],
    options: { sizes: ['110 cm', '115 cm', '120 cm', '125 cm'] },
    stripePriceId : process.env.STRIPE_PRICEID_PRODUCT_WOOD,
    isActive: true,
  },
];

export const getAllProducts = () => PRODUCTS.filter(p => p.isActive);
export const getProductBySlug = (slug) =>
  PRODUCTS.find(p => p.slug === slug && p.isActive) || null;