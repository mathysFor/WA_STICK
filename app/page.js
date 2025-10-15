import { Hero } from "@/components/home/hero/Hero";
import { Products } from "@/components/home/products/products";
import Image from "next/image";
import footerHero from '../assets/footer_hero.jpg'

export default function Home() {
  return (
    <div>
        <Hero/>
        <Products/>
        <Image
        src={footerHero}
        className="w-full h-[500px]   object-cover object-center mt-10"
        />



    </div>
  )
}