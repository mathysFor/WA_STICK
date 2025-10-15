import React from "react";
import Image from "next/image";
import teamPhoto from "../../assets/bg.jpg"; // placeholder, remplace si tu veux une photo par membre

const TEAM = [
  {
    name: "Mickael",
    role: "Rider & Créateur",
    desc:
      "Mickaël Bimboès est un skieur freeride pro et créateur de WinterActivity, connu pour ses vidéos engagées et son esprit de liberté en montagne.",
  },
  {
    name: "Julie",
    role: "Rider",
    desc:
      "Mickaël Bimboès est un skieur freeride pro et créateur de WinterActivity, connu pour ses vidéos engagées et son esprit de liberté en montagne.",
  },
  {
    name: "Mathys",
    role: "Rider & Dev",
    desc:
      "Mickaël Bimboès est un skieur freeride pro et créateur de WinterActivity, connu pour ses vidéos engagées et son esprit de liberté en montagne.",
  },
  {
    name: "Fred",
    role: "Rider",
    desc:
      "Mickaël Bimboès est un skieur freeride pro et créateur de WinterActivity, connu pour ses vidéos engagées et son esprit de liberté en montagne.",
  },
];

export default function Apropos() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold">Qui sommes-nous ?</h1>
        <div className="mx-auto my-6 h-px w-40 bg-black/20" />
        <p className="mx-auto max-w-3xl text-center leading-relaxed text-black/80">
          WinterActivity, c'est une bande de riders passionnés de montagne qui vivent pour l'adrénaline.
          Née dans les Alpes, la chaîne partage des vidéos de ski freeride, de VTT, de voyages et de défis complètement fous.
          Entre humour, engagement et images spectaculaires, l'équipe menée par Mickaël Bimboès capture l'esprit pur de l'aventure en montagne.
          Leur objectif : transmettre l'émotion du ride et donner envie à chacun de sortir, explorer et se dépasser.
        </p>

        {/* Team grid */}
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ">
          {TEAM.map((p) => (
            <article
              key={p.name}
              className="overflow-hidden rounded-[10px] h-[350px] border border-black/10 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-40 w-full">
                <Image src={teamPhoto} alt={p.name} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-black/60">{p.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-black/80">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Video placeholder / embed */}
        <div className="mt-16">
          <div className="relative w-full overflow-hidden rounded-2xl border border-black/10 bg-black/[.04]">
            {/* 16/9 */}
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              {/* Remplace par un <iframe> YouTube/Vimeo */}
              <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-black/60">
                VIDÉO WA ?
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}