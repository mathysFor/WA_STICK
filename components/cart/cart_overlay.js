// components/cart/CartOverlay.jsx
"use client";
import { useEffect,useState } from "react";
import { useCartUI } from "@/stores/useCartUi";
import { useRouter, usePathname } from "next/navigation";
import CartItem from "./card_item";
import useCartStore from "@/stores/useCartStore";
const fmt = (v) => {
  const n = Number(v ?? 0);
  if (Number.isNaN(n)) return String(v ?? "");
  return n.toFixed(2).replace(".", ",") + "€";
};

export default function CartOverlay({ mode = "overlay" }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, close, open } = useCartUI();

  const [searchString, setSearchString] = useState("");
  const [searchReady, setSearchReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateSearch = () => {
      setSearchString(window.location.search || "");
      setSearchReady(true);
    };

    // Initial read
    updateSearch();

    // Listen to browser back/forward
    const onPopState = () => updateSearch();
    window.addEventListener('popstate', onPopState);

    // Patch pushState/replaceState to emit a custom event we can listen to
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    const notify = () => window.dispatchEvent(new Event('wa:navigate'));
    history.pushState = function(...args) { origPush.apply(this, args); notify(); };
    history.replaceState = function(...args) { origReplace.apply(this, args); notify(); };

    const onNavigate = () => updateSearch();
    window.addEventListener('wa:navigate', onNavigate);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('wa:navigate', onNavigate);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, []);

  const isQueryOpen = new URLSearchParams(searchString || "").get("cart") === "open";

  // Sync URL <-> UI when used as overlay
  useEffect(() => {
    if (mode !== "overlay" || !searchReady) return;
    if (isQueryOpen && !isOpen) open();
    if (!isQueryOpen && isOpen) close();
  }, [isQueryOpen, isOpen, open, close, mode, searchReady]);

  const handleClose = () => {
    close();
    // remove ?cart=open but keep other params
    const params = new URLSearchParams(searchString || "");
    params.delete("cart");
    const url = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(url, { scroll: false });
  };
  // Cart state (store)
  const items = useCartStore((s) => s.items);
  const inc = useCartStore((s) => s.inc);
  const dec = useCartStore((s) => s.dec);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleExtra = useCartStore((s) => s.toggleExtra);
  const getSubtotal = useCartStore((s) => s.getSubtotal);


  const handleCheckout = async () => {

    if (!items || items.length === 0 || isPaying) return;
 const lineItems = [];

items.forEach((line) => {

  // ligne principale : paire de bâtons
  if (line.stripePriceId) {
    lineItems.push({
      price: line.stripePriceId,
      quantity: line.qty || 1,
    });
  }




  // extra : bâton de secours (facturé comme produit séparé)
  if (line.extra?.checked) {
    lineItems.push({
      price: "price_1SVBsiRSqCge6S7JZZKNm5TZ",
      quantity: 1,
    });
  }
});



    try {
      setIsPaying(true);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lineItems }),
      });

      if (!res.ok) {
        console.error("[checkout] Erreur HTTP", res.status);
        return;
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("[checkout] Pas d'URL de checkout retournée", data);
      }
    } catch (err) {
      console.error("[checkout] Erreur réseau ou Stripe", err);
    } finally {
      setIsPaying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {mode === "overlay" && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
          onClick={handleClose}
        >
          <div
            className="w-[760px] max-w-[92vw] bg-white rounded-2xl shadow-2xl border overflow-hidden relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
            >
              ✕
            </button>
            {/* Header */}
            <div className="px-6 sm:px-8 pt-6 sm:pt-8">
              <h2 className="text-center text-2xl sm:text-[26px] font-semibold">
                Votre panier
              </h2>
            </div>

            {/* Columns header */}
            <div
              className="mt-6 border-t border-b px-6 sm:px-8 py-3 text-[13px] text-gray-500 hidden sm:grid"
              style={{ gridTemplateColumns: "1fr 140px 120px" }}
            >
              <div>Le produit</div>
              <div className="text-center">Quantité</div>
              <div className="text-right">Total</div>
            </div>

            {/* Items */}
            <div className="px-6 sm:px-8 py-4 max-h-[60vh] overflow-auto">
              {items.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-10">
                  Ton panier est vide.
                </p>
              ) : (
                <ul className="space-y-6">
                  {items.map((line) => {
                    const lineTotal =
                      (line.unitPrice * (line.qty || 1)) +
                      ((line.extra && line.extra.checked) ? (line.extra.price || 0) : 0);
                    return (
                      <CartItem
                        key={line.id}
                        image={typeof line.image === 'string' ? line.image : (line.image?.src || '')}
                        title={line.title}
                        unitPriceEUR={line.unitPrice}
                        qty={line.qty}
                        totalEUR={lineTotal}
                        onDec={() => dec(line.id)}
                        onInc={() => inc(line.id)}
                        onRemove={() => removeItem(line.id)}
                        extraLabel={line.extra ? `${line.extra.label} pour ${fmt(line.extra.price)}` : undefined}
                        extraChecked={line.extra?.checked}
                        onToggleExtra={() => toggleExtra(line.id)}
                        isDragstick={line.title === "Le Drastick"}
                      />
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sous-Total</span>
                <span className="font-semibold">{fmt(getSubtotal())}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || isPaying}
                className="mt-4 w-full bg-pink-500 text-white rounded-md px-6 py-3 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPaying ? "Redirection en cours..." : "Procéder au paiement"}
              </button>
              <p className="mt-2 text-[11px] text-gray-500 text-center">
                Taxes incluses. Frais d&apos;expédition calculés à l&apos;étape
                de paiement.
              </p>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
