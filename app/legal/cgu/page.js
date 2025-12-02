export default function CGUPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
        Conditions Générales d’Utilisation (CGU) – wastick.com
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Date de dernière mise à jour : 25/11/2025
      </p>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">1. Éditeur et exploitation du site</h2>
        <p>
          Le site{' '}
          <a
            href="https://wastick.com"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            https://wastick.com
          </a>{' '}
          est édité et exploité par :
        </p>
        <p>WA! Productions</p>
        <p>Adresse : 99 Place Clothilde Villemartin, 73350 Bozel, France</p>
        <p>Forme juridique : SAS</p>
        <p>SIREN : 882 296 833</p>
        <p>Numéro TVA : FR04882296833</p>
        <p>Capital social : 1 000 €</p>
        <p>Inscription RCS : Chambéry</p>
        <p>
          Le site a été développé par <strong>Mathys Fornasier</strong>, auteur du
          code et propriétaire du développement. Le site est exploité par{' '}
          <strong>WA! Productions</strong>.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">2. Objet du site</h2>
        <p>
          Le site <strong>wastick.com</strong> propose :
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>La vente de bâtons de montagne.</li>
          <li>La présentation du collectif Winteractivity.</li>
        </ul>
        <p>
          Le site contient également un formulaire de contact et de réclamation
          pour toutes demandes liées aux commandes ou au site.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">3. Acceptation des CGU</h2>
        <p>
          En accédant au site ou en l’utilisant, vous acceptez de respecter les
          présentes CGU. Si vous n’acceptez pas ces conditions, vous n’êtes pas
          autorisé à utiliser ce site.
        </p>
        <p>L’utilisation du site est réservée aux personnes majeures.</p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">4. Propriété intellectuelle</h2>
        <p>
          Toutes les photos, vidéos, textes et éléments graphiques présents sur le
          site appartiennent à leur auteur respectif.
        </p>
        <p>
          Toute reproduction, distribution, modification ou utilisation commerciale
          de ces éléments sans autorisation est strictement interdite.
        </p>
        <p>
          Le code source du site est la propriété de <strong>Mathys Fornasier</strong>.
          Tout usage sans autorisation est interdit.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">5. Liens vers des sites tiers</h2>
        <p>
          Le site peut contenir des liens vers des sites tiers (notamment des
          réseaux sociaux). <strong>WA! Productions</strong> n’est pas responsable
          du contenu ou des pratiques de ces sites externes.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">6. Responsabilité</h2>
        <p>
          Le site est fourni « tel quel » et <strong>WA! Productions</strong> ne
          garantit pas un accès continu, ininterrompu ou sans erreur.
        </p>
        <p>WA! Productions ne pourra être tenue responsable :</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Des dommages directs ou indirects résultant de l’utilisation du site ;</li>
          <li>Des erreurs dans les informations affichées sur le site ;</li>
          <li>Des pertes liées aux transactions ou à l’accès aux contenus.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">7. Modification des CGU</h2>
        <p>
          <strong>WA! Productions</strong> se réserve le droit de modifier ces CGU
          à tout moment, sans préavis. Les utilisateurs sont invités à consulter
          régulièrement cette page.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">8. Données personnelles</h2>
        <p>Les données collectées via le site sont uniquement utilisées pour :</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Le traitement des commandes ;</li>
          <li>Le bon fonctionnement du site.</li>
        </ul>
        <p>
          Vous pouvez exercer vos droits via le formulaire de contact du site.
        </p>
        <p>
          Le responsable du traitement des données est : <strong>WA! Productions</strong>.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">9. Médiation en cas de litige</h2>
        <p>
          Conformément aux CGV, tout litige relatif à l’utilisation du site ou à un
          achat pourra faire l’objet d’une médiation gratuite auprès du médiateur
          suivant :
        </p>
        <p>
          <strong>Médiateur du e-commerce – FEVAD</strong>
          <br />
          Adresse postale : 60 Rue de la Boétie, 75008 Paris, France
          <br />
          Site internet :{' '}
          <a
            href="https://www.mediateurfevad.fr"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            https://www.mediateurfevad.fr
          </a>
          <br />
          Adresse e-mail :{' '}
          <a href="mailto:contact@mediateurfevad.fr" className="underline">
            contact@mediateurfevad.fr
          </a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">10. Loi applicable et juridiction</h2>
        <p>
          Les présentes CGU sont régies par le droit français. Tout litige sera
          soumis aux tribunaux compétents français.
        </p>
      </section>
    </main>
  );
}
