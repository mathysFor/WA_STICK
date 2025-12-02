export const metadata = {
  title: 'Contact | WAstick',
  description: "Contactez l'équipe WAstick",
};

import Image from 'next/image';

import HeaderImage from '../../assets/footer_shop.png'

export default function Contact() {
  return (
    <main className="min-h-screen w-full">
      {/* HERO / BANNER IMAGE */}
      <section className="w-full">
        <Image
          src={HeaderImage}
          alt="Skiers on a snowy ridge"
          className="w-full h-56 md:h-80 object-cover"
        />
    
      </section>

      {/* TITLE + FORM */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <h1 className="text-center text-3xl md:text-4xl font-semibold tracking-tight mb-8 md:mb-10">
          Contactez-nous
        </h1>

        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nom & prénom"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <input
            type="number"
            name="commande"
            placeholder="Numéro de commande (optionnel)"
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />

          <textarea
            name="message"
            placeholder="Commentaire"
            rows={6}
            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />

          {/* Submit button (optional to match your screenshot, but useful) */}
          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center bg-[#E645AC] rounded-md  px-6 py-3 text-sm font-medium text-white tracking-wide hover:opacity-90 active:opacity-80"
            >
              Envoyer
            </button>
          </div>
        </form>
      </section>
 
    </main>
  );
}