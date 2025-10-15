'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logoImg from '../assets/logo.png'
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCartUI } from "@/stores/useCartUi";
import useCartStore from "@/stores/useCartStore";

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/a-propos', label: 'À propos' },
]

export default function Topbar() {

  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const { open: openCartUI } = useCartUI();
  const cartCount = useCartStore((s) => s.items.reduce((acc, i) => acc + (i.qty || 1), 0));
  const [menuOpen, setMenuOpen] = useState(false);

  const openCart = () => {
    const params = new URLSearchParams(search?.toString() || "");
    params.set("cart", "open");
    router.push(`${pathname}?${params}`, { scroll: false });
    openCartUI();
  };




  return (
    <header className=" top-0 z-40 bg-white/90 backdrop-blur border-b border-black/5 px-4 md:px-6 relative">
      <div className="relative flex items-center h-16">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={logoImg} width={40} height={40} alt="WAstick" className="h-10 w-auto" />
        </Link>

        {/* Right zone: Nav (desktop) + Cart + Burger (mobile) */}
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {/* Desktop nav aligned RIGHT */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-medium text-black hover:opacity-80 transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cart (always visible) */}
          <button
            onClick={openCart}
            className="relative inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-black/10"
            aria-label="Panier"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black" aria-hidden="true">
              <path d="M7 7V6a5 5 0 1110 0v1h1a2 2 0 012 2v10a3 3 0 01-3 3H7a3 3 0 01-3-3V9a2 2 0 012-2h1zm2 0h6V6a3 3 0 10-6 0v1zM6 9v10a1 1 0 001 1h10a1 1 0 001-1V9H6z"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Burger (mobile only) — placed to the RIGHT of the cart */}
          <button
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-black/10"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen ? 'true' : 'false'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black" aria-hidden="true">
              <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown aligned RIGHT */}
      {menuOpen && (
        <div className="md:hidden absolute right-0 top-full bg-white border-b border-black/5 shadow-soft min-w-[220px]">
          <ul className="flex flex-col py-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium hover:bg-black/5 text-right"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
