"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import {useCartStore} from "@/stores/useCartStore";
import { useCartUI } from "@/stores/useCartUi";
import { useRouter, usePathname } from "next/navigation";

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  const router = useRouter();
  const pathname = usePathname();
  const addItem = useCartStore((s) => s.addItem);
  const { open } = useCartUI();

  const getSrc = (img) => (typeof img === "string" ? img : img?.src || "");
  const IMAGES = (product.images || []).map(getSrc);
  const SPECS = product.specs || [];
  const DIRECT_CHECKOUT_URL = product.directCheckoutUrl || product.paymentLinkUrl || "";
  const isDirectCheckout = !!DIRECT_CHECKOUT_URL;

  // prices derived from product data
  let BASE_PRICE = 0;
  let RESCUE_PRICE = 0;

  BASE_PRICE = product.priceEUR || 0;
  const rescueExtra = product?.options?.extras?.find((e) => e.id === "rescue");
  RESCUE_PRICE = rescueExtra ? rescueExtra.priceEUR || 0 : 0;

  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(product?.options?.sizes?.[0] || "Taille unique");
  const [sizesList, setSizesList] = useState([product?.options?.sizes?.[0] || "Taille unique"]);
  const [rescue, setRescue] = useState(false);
  const [searchString, setSearchString] = useState("");
  const taxText = isDirectCheckout
    ? "TVA non applicable – article 293 B du CGI. Frais d'expédition calculés à l'étape de paiement."
    : "Taxes incluses. Frais d'expédition calculés à l'étape de paiement.";

  // Add-to-cart confirmation popup
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Loading state for add-to-cart UX
  const [adding, setAdding] = useState(false);

  // --- Mobile carousel viewport width handling ---
  const viewportRef = useRef(null);
  const [viewportW, setViewportW] = useState(0);

  useEffect(() => {
    const updateW = () => {
      if (viewportRef.current) {
        setViewportW(viewportRef.current.clientWidth);
      }
    };
    updateW();
    window.addEventListener('resize', updateW);
    return () => window.removeEventListener('resize', updateW);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchString(window.location.search || "");
    }
  }, []);

  const total = useMemo(() => {
    const pairsTotal = BASE_PRICE * qty;
    const rescueTotal = rescue ? RESCUE_PRICE : 0;
    return (pairsTotal + rescueTotal).toFixed(2).replace(".", ",");
  }, [qty, rescue]);

  const primaryLabel = isDirectCheckout
    ? `Acheter maintenant (${total}€)`
    : `Ajouter au panier (${total}€)`;


    
 const handleBuyNow = async () => {
    try {
      const res = await fetch("/api/create-checkout-wood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: qty,
          sizes: sizesList,
          productSlug: product.slug,
          id: product.id,
        }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          try {
            const data = await res.json();
            const msg =
              data?.error ||
              "Ce produit est épuisé ou la quantité demandée n'est plus disponible.";
            alert(msg);
          } catch (err) {
            alert(
              "Ce produit est épuisé ou la quantité demandée n'est plus disponible."
            );
          }
        } else {
          console.error("[checkout] Failed to create session", res.status);
          alert(
            "Une erreur est survenue lors de la création du paiement. Merci de réessayer."
          );
        }
        return;
      }

      const data = await res.json();
      if (data?.url) {
        if (typeof window !== "undefined") {
          window.location.href = data.url;
        } else {
          router.push(data.url);
        }
      }
    } catch (e) {
      console.error("[checkout] Error calling create-checkout-wood:", e);
      alert(
        "Une erreur est survenue lors de la création du paiement. Merci de réessayer."
      );
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);

    const productId = `${product.slug}:${size}`;
    const firstImage = (product.images && product.images[0]) || "";

    addItem({
      id: `${productId}-${Date.now()}`,
      productId,
      title: product.name,
      image: typeof firstImage === "string" ? firstImage : firstImage?.src || "",
      unitPrice: product.priceEUR || 0,
      qty,
      extra: rescueExtra
        ? {
            id: "rescue",
            label: "Un bâton de secours",
            price: RESCUE_PRICE,
            checked: !!rescue,
            // IMPORTANT: ce champ doit contenir le price_xxx du bâton de secours
            stripePriceId: rescueExtra.stripePriceId || "",
          }
        : undefined,
      stripePriceId: product.stripePriceId || "",
      idFirestore: product.id || "",
    });

    // short delay to surface loader feedback
    setTimeout(() => {
      setAdding(false);
      setConfirmOpen(true);
    }, 600);
  };

  const handleSeeCart = () => {
    const params = new URLSearchParams(searchString || "");
    params.set("cart", "open");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    open();
    setConfirmOpen(false);
  };

  const handleContinue = () => setConfirmOpen(false);


  return (
    <main className="min-h-screen w-full">
      {/* WRAPPER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* GRID DESKTOP */}
        <div className="hidden md:grid grid-cols-12 gap-8">
          {/* LEFT: GALLERY */}
          <div className="col-span-6">
            <div className="aspect-square w-full overflow-hidden rounded-md border">
              <img
                src={IMAGES[active]}
                alt="Drastick main"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {IMAGES.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActive(i)}
                  className={`aspect-square overflow-hidden rounded-md border ${
                    active === i ? "ring-2 ring-gray-900" : ""
                  }`}
                >
                  <img src={img} alt={`Thumb ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="col-span-6">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{product.name}</h1>
            <p className="mt-3 text-gray-800 font-medium">{(product.priceEUR || 0).toFixed(2).replace(".", ",")}€ · la paire</p>
            <p className="mt-1 text-xs text-gray-500">
              {taxText}
            </p>

            {/* SIZE */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Taille</label>
              <select
                className="w-full max-w-xs rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                {(product?.options?.sizes || ["Taille unique"]).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* QTY */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Quantité</label>
              <div className="inline-flex items-center gap-4 rounded-md border px-3 py-2">
                <button
                  type="button"
                  onClick={() => {
                    setQty((q) => {
                      const newQ = Math.max(1, q - 1);
                      setSizesList((prev) => prev.slice(0, newQ));
                      return newQ;
                    });
                  }}
                  className="h-8 w-8 grid place-items-center rounded-md border"
                >
                  –
                </button>
                <span className="min-w-[1.5rem] text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => {
                    setQty((q) => {
                      const newQ = Math.min(99, q + 1);
                      setSizesList((prev) => {
                        const baseSize = product?.options?.sizes?.[0] || "Taille unique";
                        if (prev.length >= newQ) return prev;
                        const copy = [...prev];
                        while (copy.length < newQ) {
                          copy.push(baseSize);
                        }
                        return copy;
                      });
                      return newQ;
                    });
                  }}
                  className="h-8 w-8 grid place-items-center rounded-md border"
                >
                  +
                </button>
              </div>
            </div>

            {!((product.id === "fantastic" )||( product.id === "drastick")) && sizesList.length > 1 && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Tailles supplémentaires</label>
                <div className="flex flex-col gap-3">
                  {sizesList.slice(1).map((sz, idx) => (
                    <select
                      key={idx}
                      className="w-full max-w-xs rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      value={sz}
                      onChange={(e) => {
                        const updated = [...sizesList];
                        updated[idx + 1] = e.target.value;
                        setSizesList(updated);
                      }}
                    >
                      {(product?.options?.sizes || ["Taille unique"]).map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            )}

            {/* RESCUE (only for Drastick / products with rescue extra) */}
            {rescueExtra && (
              <label className="mt-6 flex items-center gap-3 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rescue}
                  onChange={(e) => setRescue(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>
                  Un bâton de secours pour {RESCUE_PRICE}€
                </span>
              </label>
            )}

            {/* CTA */}
            <div className="mt-6">
              <button
                onClick={isDirectCheckout ? handleBuyNow : handleAddToCart}
                disabled={!isDirectCheckout && adding}
                className={`w-full sm:w-auto sm:min-w-[260px] inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold tracking-wide ${
                  !isDirectCheckout && adding
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-pink-500 text-white hover:opacity-90 active:opacity-80"
                }`}
              >
                {!isDirectCheckout && adding ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg
                      className="animate-spin h-4 w-4 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Ajout...
                  </span>
                ) : (
                  primaryLabel
                )}
              </button>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-6 text-sm leading-6 text-gray-700">
{product.description}
            </p>

            {/* TECH SPECS (desktop) */}
            <div className="mt-8">
              <h2 className="text-base font-semibold tracking-tight mb-3">Caractéristiques techniques</h2>
              <div className="rounded-md border p-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                  {SPECS.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4">
                      <dt className="text-gray-600 w-32 shrink-0">{row.label}</dt>
                      <dd className="font-medium text-gray-900 flex-1">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE VIEW: CAROUSEL + CONTENT BELOW */}
        <div className="md:hidden">
          {/* Carousel */}
          <div className="relative -mx-4 px-4">
            <div ref={viewportRef} className="overflow-hidden">
              <div
                id="carousel"
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${active * viewportW}px)` }}
              >
                {IMAGES.map((img, i) => (
                  <div key={img} className="flex-shrink-0" style={{ width: viewportW || '100%' }}>
                    <div className="aspect-square w-full overflow-hidden rounded-md border">
                      <img src={img} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Carousel controls below */}
          <div className="mt-3 flex items-center justify-center gap-6">
            <button
              onClick={() => setActive((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1))}
              className="bg-white bg-opacity-80 rounded-full h-8 w-8 grid place-items-center shadow-md border border-gray-200"
            >
              ‹
            </button>
            <span className="text-sm text-gray-600">{active + 1}/{IMAGES.length}</span>
            <button
              onClick={() => setActive((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1))}
              className="bg-white bg-opacity-80 rounded-full h-8 w-8 grid place-items-center shadow-md border border-gray-200"
            >
              ›
            </button>
          </div>

          {/* Content */}
          <div className="mt-6">
            <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-gray-800 font-medium">{(product.priceEUR || 0).toFixed(2).replace(".", ",")}€ · la paire</p>
            <p className="text-xs text-gray-500 mt-1">
              {taxText}
            </p>

            {/* Size */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2">Taille</label>
              <select
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                {(product?.options?.sizes || ["Taille unique"]).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Qty */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2">Quantité</label>
              <div className="inline-flex items-center gap-4 rounded-md border px-3 py-2">
                <button
                  type="button"
                  onClick={() => {
                    setQty((q) => {
                      const newQ = Math.max(1, q - 1);
                      setSizesList((prev) => prev.slice(0, newQ));
                      return newQ;
                    });
                  }}
                  className="h-8 w-8 grid place-items-center rounded-md border"
                >
                  –
                </button>
                <span className="min-w-[1.5rem] text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => {
                    setQty((q) => {
                      const newQ = Math.min(99, q + 1);
                      setSizesList((prev) => {
                        const baseSize = product?.options?.sizes?.[0] || "Taille unique";
                        if (prev.length >= newQ) return prev;
                        const copy = [...prev];
                        while (copy.length < newQ) {
                          copy.push(baseSize);
                        }
                        return copy;
                      });
                      return newQ;
                    });
                  }}
                  className="h-8 w-8 grid place-items-center rounded-md border"
                >
                  +
                </button>
              </div>
            </div>

            {sizesList.length > 1 && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Tailles supplémentaires</label>
                <div className="flex flex-col gap-3">
                  {sizesList.slice(1).map((sz, idx) => (
                    <select
                      key={idx}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      value={sz}
                      onChange={(e) => {
                        const updated = [...sizesList];
                        updated[idx + 1] = e.target.value;
                        setSizesList(updated);
                      }}
                    >
                      {(product?.options?.sizes || ["Taille unique"]).map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            )}

            {/* Rescue (only for Drastick / products with rescue extra) */}
            {rescueExtra && (
              <label className="mt-5 flex items-center gap-3 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rescue}
                  onChange={(e) => setRescue(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Un bâton de secours pour {RESCUE_PRICE}€</span>
              </label>
            )}

            {/* CTA */}
            <div className="mt-5">
              <button
                onClick={isDirectCheckout ? handleBuyNow : handleAddToCart}
                disabled={!isDirectCheckout && adding}
                className={`w-full sm:w-auto sm:min-w-[260px] inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold tracking-wide ${
                  !isDirectCheckout && adding
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-pink-500 text-white hover:opacity-90 active:opacity-80"
                }`}
              >
                {!isDirectCheckout && adding ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg
                      className="animate-spin h-4 w-4 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Ajout...
                  </span>
                ) : (
                  primaryLabel
                )}
              </button>
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-6 text-gray-700">
              Le drastick est le bâton connu pour sa simplicité, légèreté. Sans dragone pour vous embêter, il vous accompagnera dans toutes vos sorties, freeride, freestyle, même sur les pistes.
            </p>

            {/* TECH SPECS (mobile) */}
            <div className="mt-6">
              <h2 className="text-base font-semibold tracking-tight mb-3">Caractéristiques techniques</h2>
              <div className="rounded-md border p-4">
                <dl className="grid grid-cols-1 gap-y-2 text-sm">
                  {SPECS.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4">
                      <dt className="text-gray-600 w-28 shrink-0">{row.label}</dt>
                      <dd className="font-medium text-gray-900 flex-1">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

 
      </div>

      {/* Add-to-cart confirmation modal */}
      {!isDirectCheckout && confirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleContinue}
            aria-hidden
          />
          {/* Card */}
          <div className="relative z-[61] w-full sm:w-auto sm:min-w-[420px] max-w-[92vw] sm:max-w-[520px] bg-white rounded-2xl shadow-2xl border p-6 m-4">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
              aria-label="Fermer"
              onClick={handleContinue}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold">Produit ajouté au panier</h3>
            <p className="mt-1 text-sm text-gray-600">« {product.name} » a bien été ajouté à votre panier.</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleContinue}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
              >
                Continuer mes achats
              </button>
              <button
                onClick={handleSeeCart}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-pink-500 text-white px-5 py-3 text-sm font-semibold"
              >
                Procéder au paiement
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
