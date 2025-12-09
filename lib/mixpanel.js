import mixpanel from "mixpanel-browser";

let initialized = false;

export const initMixpanel = () => {
  if (initialized) return;
  
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) {
    console.warn("[Mixpanel] Token non défini. Analytics désactivé.");
    return;
  }

  mixpanel.init(token, {
    track_pageview: false, // On gère manuellement via le provider
    persistence: "localStorage",
    ignore_dnt: false,
  });
  
  initialized = true;
};

export const isInitialized = () => initialized;

// Tracking générique
export const trackEvent = (event, properties = {}) => {
  if (!initialized) return;
  mixpanel.track(event, properties);
};

// Page view
export const trackPageView = (path, referrer = "") => {
  if (!initialized) return;
  mixpanel.track("Page View", {
    path,
    referrer,
    timestamp: new Date().toISOString(),
  });
};

// Vue produit
export const trackProductView = (product) => {
  if (!initialized) return;
  mixpanel.track("Product Viewed", {
    product_id: product.id || product.slug,
    product_name: product.name || product.title,
    price: product.priceEUR || product.price || 0,
    category: product.category || "baton",
  });
};

// Ajout au panier
export const trackAddToCart = (product, quantity = 1) => {
  if (!initialized) return;
  mixpanel.track("Add to Cart", {
    product_id: product.id || product.productId || product.slug,
    product_name: product.name || product.title,
    quantity,
    price: product.priceEUR || product.unitPrice || 0,
    total: (product.priceEUR || product.unitPrice || 0) * quantity,
  });
};

// Suppression du panier
export const trackRemoveFromCart = (product) => {
  if (!initialized) return;
  mixpanel.track("Remove from Cart", {
    product_id: product.id || product.productId,
    product_name: product.name || product.title,
  });
};

// Début du checkout
export const trackCheckoutStart = (items, totalAmount) => {
  if (!initialized) return;
  mixpanel.track("Checkout Started", {
    items_count: items.length,
    total_amount: totalAmount,
    items: items.map((item) => ({
      id: item.id || item.productId,
      name: item.title || item.name,
      quantity: item.qty || item.quantity || 1,
      price: item.unitPrice || item.price || 0,
    })),
  });
};

// Identifier un utilisateur (optionnel, pour plus tard)
export const identifyUser = (userId, traits = {}) => {
  if (!initialized) return;
  mixpanel.identify(userId);
  if (Object.keys(traits).length > 0) {
    mixpanel.people.set(traits);
  }
};

