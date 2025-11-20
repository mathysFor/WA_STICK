export default function MerciPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Merci pour votre commande 🥳</h1>
      <p className="text-lg text-gray-600 max-w-xl">
        Votre commande a bien été prise en compte. Vous recevrez un email de confirmation
        dans quelques instants.
      </p>
      <a
        href="/"
        className="mt-8 inline-block px-6 py-3 bg-[#E645AC]  text-white rounded-lg hover:bg-gray-800 transition"
      >
        Retourner à l'accueil
      </a>
    </main>
  );
}
