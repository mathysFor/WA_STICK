import React from "react";
import Image from "next/image";
import teamPhoto from "../../assets/bg.jpg"; // placeholder, remplace si tu veux une photo par membre

const TEAM = [
  {
    name: "Mickaël",
    role: "Rider & Créateur",
    desc: "Moteur du collectif, Mickael œuvre aussi bien dans la réalisation des vidéos que dans celle des podiums en allant jusqu’à remporter la plus prestigieuse des compétitions qu’est l’Extrem de Verbier en 2018 et terminant 3ème au classement général du Freeride World Tour.",
  },
  {
    name: "Mathys",
    role: "Rider & Dev",
    desc: "Rookie sur la scène compétitive, Mathys a déjà montré un engagement digne des plus grands avec pour priorité la réalisation de lignes originales où la majorité n'ose pas s’aventurer.",
  },
  {
    name: "Julie",
    role: "Rider",
    desc: "Le sourire de Winteractivity, vous le retrouverez chez Julie une énergie aussi bien solaire que musculaire lorsqu’il s’agit de faire la première trace en ski de randonnée. Vous pouvez compter sur elle pour inspirer la gente féminine et lui montrer qu’elle a sa place dans la pratique des sports extrêmes en montagne.",
  },
  {
    name: "William",
    role: "Rider",
    desc: "L’un des pionniers du collectif, William a passé de nombreuses années sur le circuit des Qualifier avant de passer de l’autre côté des jumelles en tant que juge. Discret de nature, attaché à une pratique du sport sobre et éthique, vous retrouverez cette même ADN dans les films qu’il produit.",
  },
];

export default function Apropos() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold">
          Qui sommes-nous ?
        </h1>
        <div className="mx-auto my-6 h-px w-40 bg-black/20" />
        <p className="mx-auto max-w-3xl text-center leading-relaxed text-black/80">
          Né de la passion du freeride et de la montagne, Winteractivity est un
          collectif qui réunit une bande d’amis prêts à s’élancer dans des
          pentes vierges, toujours animés par un trop plein l’énergie et de la
          bonne humeur. Composé de profils et de visions très variés, le fil
          rouge de leur chaîne YouTube est la performance en montagne, notamment
          sur les compétitions du Freeride World Tour. On y découvrehjk les
          coulisses des riders, leur joie à l’entraînement et les défis qu’ils
          rencontrent. Il leur tient à cœur de démocratiser la pratique du ski
          en montagne et de vulgariser le fonctionnement du circuit
          professionnel compétitif.
        </p>

        {/* Team grid */}
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ">
          {TEAM.map((p) => (
            <article
              key={p.name}
              className="overflow-hidden rounded-[10px] min-h-[400px] border border-black/10 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={teamPhoto}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                {/* <p className="mt-1 text-sm text-black/60">{p.role}</p> */}
                <p className="mt-3 text-sm leading-relaxed text-black/80">
                  {p.desc}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Video placeholder / embed */}
        {/* <div className="mt-16">
          <div className="relative w-full overflow-hidden rounded-2xl border border-black/10 bg-black/[.04]"> */}
            {/* 16/9 */}
            {/* <div className="relative w-full" style={{ paddingTop: "56.25%" }}> */}
              {/* Remplace par un <iframe> YouTube/Vimeo */}
              {/* <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-black/60"> */}
                {/* VIDÉO WA ? */}
              {/* </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
