

import React from "react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-black/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Grid: 1 col on mobile, 3 cols on md+ */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16">
          {/* Col 1 */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">Quelques liens</h3>
            <ul className="space-y-3 text-lg">
              <li>
                <Link href="/legal/mentions-legales" className="hover:underline">Mentions légales</Link>
              </li>
              <li>
                <Link href="/legal/politique-confidentialite" className="hover:underline">Politique de confidentialité</Link>
              </li>
              <li>
                <Link href="/legal/cgv" className="hover:underline">Conditions générales de vente</Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">WA-STICK</h3>
            <ul className="space-y-3 text-lg">
              <li>
                <Link href="/a-propos" className="hover:underline">À propos</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">Suivez-nous</h3>
            <ul className="space-y-3 text-lg">
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Youtube
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-10 pt-6 border-t border-black/10 text-center text-sm sm:text-base text-black/70">
          © {year} WA-STICK — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}