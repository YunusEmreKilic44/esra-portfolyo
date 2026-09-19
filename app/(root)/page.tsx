import Contact from "@/components/Contact/Contact";
import { getAbout } from "@/lib/actions/about/getAbout";
import { getCollections } from "@/lib/actions/collection/getCollections";
import { getLookbookImages } from "@/lib/actions/lookbook/getLookbookImages";
import Image from "next/image";
import Link from "next/link";

const facts = (about: Awaited<ReturnType<typeof getAbout>>["result"]["about"]) => [
  ["Eğitim", about?.education],
  ["Uzmanlık", about?.uzmanlik],
  ["Araçlar", about?.applications],
  ["Diller", about?.languages],
];

export default async function Home() {
  const [aboutResponse, collectionsResponse, lookbookResponse] = await Promise.all([
    getAbout(),
    getCollections(),
    getLookbookImages(),
  ]);
  const { about, portrait } = aboutResponse.result;
  const collections = collectionsResponse.result;
  const lookbookImages = lookbookResponse.result;

  return (
    <main>
      <section className="animate-in fade-in slide-in-from-bottom-12 px-4 pb-16 pt-14 duration-1000 ease-out motion-reduce:animate-none sm:px-6 sm:pb-18 sm:pt-20 lg:px-12 lg:pt-24">
        <span className="mb-6 flex justify-between text-xs uppercase tracking-[0.16em] text-[#f2ede4b3]">
          Moda Tasarımcısı
        </span>
        <h1 className="m-0 font-heading text-[clamp(58px,20vw,112px)] font-normal uppercase leading-[0.88] tracking-[-0.03em] md:text-[clamp(96px,14vw,240px)]">
          Esra
          <br />
          <span className="inline-block pl-[8vw] italic text-main sm:pl-[14vw] lg:pl-[18vw]">Kılıç</span>
        </h1>
        <div className="mt-10 grid grid-cols-1 items-end gap-8 md:mt-12 md:grid-cols-[minmax(0,1fr)_auto]">
          <p className="m-0 max-w-[40ch] text-pretty text-base leading-[1.6] text-[#f2ede4d9] sm:text-lg">
            Zanaat ve sürdürülebilirlik arasında köprü kuran, yapıyı yumuşaklıkla buluşturan silüetler tasarlıyorum.
          </p>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="#works" className="rounded-full bg-main px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0f0e0c] sm:px-6.5 sm:py-4 sm:text-xs">İşleri Gör</Link>
            <Link href="#about" className="rounded-full border border-[#f2ede466] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] sm:px-6.5 sm:py-4 sm:text-xs">Hakkımda</Link>
          </div>
        </div>
      </section>

      <section id="about" className="grid scroll-mt-28 grid-cols-1 items-start gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 lg:px-12 lg:py-24 xl:gap-16 xl:py-28">
        <div className="flex max-w-none flex-col gap-4">
          <div className="relative aspect-3/4 min-w-0 overflow-hidden rounded-xs bg-[#f2ede412]">
            {portrait && <Image src={portrait.imageUrl} alt="Esra Kılıç portresi" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />}
          </div>
          <div className="flex justify-between text-xs uppercase tracking-[0.14em] text-[#f2ede48c]"><span>Portre</span><span>{new Date().getFullYear()}</span></div>
        </div>

        <div>
          <div className="mb-5 text-xs uppercase tracking-[0.16em] text-main">{about?.title || "01 — Hakkımda"}</div>
          <h2 className="m-0 mb-7 text-pretty font-heading text-[clamp(32px,3.2vw,46px)] font-normal leading-[1.05] tracking-[-0.02em]">
            {about?.content || "Hakkımda içeriği yakında eklenecek."}
          </h2>
          {about && (
            <>
              <div className="grid grid-cols-1 gap-5 text-[15px] leading-[1.7] text-[#f2ede4cc] sm:grid-cols-2 sm:gap-7">
                <p className="m-0 text-pretty">{about.bio1}</p>
                <p className="m-0 text-pretty">{about.bio2}</p>
              </div>
              <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-8 border-t border-[#f2ede426] pt-7 sm:mt-11 sm:gap-6 xl:grid-cols-4">
                {facts(about).map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-2.5 text-[11px] uppercase tracking-[0.16em] text-[#f2ede480]">{label}</div>
                    <div className="whitespace-pre-line text-sm leading-[1.6]">{value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section id="works" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-28">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.16em] text-main">02 — Seçilmiş İşler</div>
          <span className="whitespace-nowrap text-xs tracking-[0.14em] text-[#f2ede480]">{collections.length} koleksiyon</span>
        </div>
        <div className="flex flex-col border-t border-[#f2ede426]">
          {collections.map((collection, index) => {
            const cover = collection.images[0];
            return (
              <Link key={collection.id} href={`/tasarimlar/${collection.id}`} className="grid cursor-pointer grid-cols-[32px_minmax(0,1fr)_72px] items-center gap-3 border-b border-[#f2ede426] py-5 transition-[padding] duration-300 md:grid-cols-[40px_minmax(0,1fr)_160px_96px] md:gap-4 md:py-6 md:hover:pl-4 lg:grid-cols-[48px_minmax(0,1fr)_200px_120px] lg:gap-6 lg:py-7">
                <span className="text-[13px] text-[#f2ede466]">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <div className="font-heading text-[clamp(30px,3.4vw,52px)] leading-none tracking-[-0.02em]">{collection.title}</div>
                  <div className="mt-2 line-clamp-2 text-sm text-[#f2ede480]">{collection.description}</div>
                </div>
                <span className="hidden text-pretty text-xs uppercase tracking-[0.14em] text-[#f2ede499] md:block">{collection.category}</span>
                <div className="relative aspect-4/5 w-18 justify-self-end overflow-hidden rounded-xs bg-[#f2ede412] md:w-24 lg:w-30">
                  {cover && <Image src={cover.imageUrl} alt={`${collection.title} kapak görseli`} fill sizes="120px" className="object-cover" />}
                </div>
              </Link>
            );
          })}
          {collections.length === 0 && <p className="py-10 text-sm text-[#f2ede480]">Henüz koleksiyon eklenmedi.</p>}
        </div>
      </section>

      <section id="lookbook" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-28">
        <div className="mb-8 text-xs uppercase tracking-[0.16em] text-main">03 — Lookbook</div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {lookbookImages.map((lookbookImage, index) => (
            <div key={lookbookImage.id} className={`relative min-w-0 overflow-hidden rounded-xs bg-[#f2ede412] ${index % 3 === 2 ? "col-span-2 aspect-3/2" : "col-span-1 aspect-3/4"}`}>
              <Image src={lookbookImage.imageUrl} alt={`Lookbook görseli ${index + 1}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
        {lookbookImages.length === 0 && <p className="text-sm text-[#f2ede480]">Henüz lookbook görseli eklenmedi.</p>}
      </section>

      <Contact />
    </main>
  );
}
