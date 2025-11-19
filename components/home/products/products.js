import React from "react";
import Image from "next/image";
import Link from "next/link";


// ✅ Use static imports so Next transforms PNGs correctly.
// (Avoid require() and avoid /@/ aliases that are not configured.)
 


import { getAllProducts } from "@/lib/products";

export const revalidate = 60;
 
export const Products = ({ fromShop }) => {

  const PRODUCTS = getAllProducts();

  return (
    <section id="products" className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl ${fromShop ? 'text-center' : ''} font-extrabold mt-10 tracking-tight  sm:mb-10`}>
          Nos Modèles
        </h2>

        {/* Cards wrapper: horizontal scroll on mobile, grid on md+ */}
        <div className="-mx-4 px-4 md:mx-0 md:px-0 mt-20">
          <div className="flex gap-6 pb-10 overflow-x-auto snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-mandatory md:grid md:grid-cols-3 md:gap-12 md:overflow-visible">
            {PRODUCTS.map((p) => (
              <Link key={p.name} href={`/products/${p.slug}`} className="snap-start shrink-0 min-w-[40%] xs:min-w-[70%] sm:min-w-[60%] md:min-w-0 md:shrink md:snap-none">
                <article
                  className="cursor-pointer rounded-2xl text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative h-64 md:h-72 flex items-end justify-center">
                    <Image
                      src={p.photo_shop}
                      alt={p.alt}
                      fill
                      className="object-contain select-none pointer-events-none"
                      sizes="(max-width: 768px) 80vw, (max-width: 1024px) 33vw, 350px"
                    />
                  </div>
                  <h3 className="mt-6 text-xl md:text-2xl font-semibold">{p.name}</h3>

                  <p className="mt-2 text-lg italic opacity-80">{fromShop ? p.priceEUR + "0€" :  p.desc_shop}</p>
                </article>
              </Link>
            ))}
          </div>
          {/* Scroll hint for mobile */}
          <div className="md:hidden flex justify-center mt-4 text-gray-500 animate-bounce">
         
            <span className="ml-2 mt-10 text-sm">Faites défiler →</span>
          </div>
        </div>
      </div>
    </section>
  );
};