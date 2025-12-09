import { Products } from "@/components/home/products/products";
import Image from "next/image";
import FooterImage from "../../assets/footer_shop.jpg";

export default function Shop() {
  return (
    <>
      <Products fromShop={true} titre={"Nos modèles"} />
      <Image
        src={FooterImage}
        alt="Photo footer"
        className="w-full h-[300px] sm:h-[350px] md:h-[400px] mt-20 mb-10 object-cover object-[center_30%]"
      />
    </>
  );
}
