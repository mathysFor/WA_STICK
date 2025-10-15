"use client";
import Image from "next/image"
import BackgroundImage from '../../../assets/bg.png'

export const Hero = () => {

    return(
            <div className="relative w-full flex justify-center items-center h-[calc(100vh-110px)]">
      <Image
        src={BackgroundImage}
        alt="Hero"
        fill
        priority
        className="object-cover object-[70%_center] md:object-center"
      />
      <div className=" z-10 mb-40 text-center">
        <h1 className="text-white text-[64px] font-bold mb-4">WA Stick</h1>
        <button
          onClick={() => {
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="text-white p-4 rounded-[12px] font-semibold px-8 bg-[#E645AC] cursor-pointer"
        >
          Voir nos produits
        </button>
      </div>
    </div>
    )
}
export default Hero;