import { Bando } from '@/components/Bando'
import Topbar from '@/components/TopBar'
import dynamic from "next/dynamic";
import '@/styles/globals.css'

import Footer from '@/components/Footer'


const CartOverlay = dynamic(() => import("@/components/cart/cart_overlay"), {
  ssr: false,
});


import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export const metadata = {
  title: 'WAstick – Bâtons de freeride',
  description: 'Bâtons de ski conçus par des riders, pour des riders.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`min-h-screen flex flex-col ${montserrat.className}`}>
        <Bando/>
        {/* ✅ Placée ici, la Topbar ne se re-render JAMAIS entre pages */}
        <Topbar />
         <CartOverlay mode="overlay" /> 
        <main className="flex-1">{children}</main>
        <Footer />



      </body>
    </html>
  )
}