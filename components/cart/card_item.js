

"use client";

export default function CartItem({
  image,
  title,
  unitPriceEUR,
  qty = 1,
  totalEUR,
  onDec = () => {},
  onInc = () => {},
  onRemove = () => {},
  extraLabel,
  extraChecked = false,
  onToggleExtra = () => {},
  isDragstick = false,
}) {
  return (
    <li className="grid sm:grid-cols-[1fr_140px_120px] gap-4 items-center">
      {/* Mobile image (full width) */}
      {image ? (
        <div className="col-span-full sm:hidden">
          <div className="aspect-square w-full rounded-md border overflow-hidden">
            <img src={image} alt={title} className="h-full w-full object-cover" />
          </div>
        </div>
      ) : null}
      {/* Col 1: Produit */}
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-md border overflow-hidden hidden sm:block">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
        <div>
          <div className="text-sm font-medium leading-5">{title}</div>
          <div className="text-xs text-gray-500">{formatPrice(unitPriceEUR)}</div>
        </div>
      </div>

      {/* Col 2: Quantité */}
      <div className="justify-self-center">
        <div className="inline-flex items-center gap-3 rounded-md border px-3 py-1.5">
          <button
            type="button"
            onClick={onDec}
            className="h-7 w-7 grid place-items-center rounded-md border"
            aria-label="Diminuer la quantité"
          >
            –
          </button>
          <span className="min-w-[1.25rem] text-center text-sm">{qty}</span>
          <button
            type="button"
            onClick={onInc}
            className="h-7 w-7 grid place-items-center rounded-md border"
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>
      </div>

      {/* Col 3: Total + remove */}
      <div className="flex items-center justify-end gap-4">
        <div className="text-sm font-medium">{formatPrice(totalEUR)}</div>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-black"
          aria-label="Retirer l'article"
          title="Retirer"
        >
          ✕
        </button>
      </div>

      {/* Ligne séparatrice + option extra en dessous */}
      {isDragstick && (


      <div className="col-span-full">
        <div className="mt-4 flex items-center gap-3 text-xs text-gray-700">
          {extraLabel ? (
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={!!extraChecked}
                onChange={onToggleExtra}
              />
              {extraLabel}
            </label>
          ) : null}
        </div>
        <div className="mt-4 border-t" />
      </div>)}
    </li>
  );
}

function formatPrice(v) {
  if (v === undefined || v === null || v === "") return "";
  const n = typeof v === "string" ? parseFloat(String(v).replace(",", ".")) : Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toFixed(2).replace(".", ",") + "€";
}