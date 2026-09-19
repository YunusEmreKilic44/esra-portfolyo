import { getCollection } from "@/lib/actions/collection/getCollection";
import Image from "next/image";
import { notFound } from "next/navigation";

interface TasarimPageProps {
  params: Promise<{ tasarimId: string }>;
}

const TasarimPage = async ({ params }: TasarimPageProps) => {
  const { tasarimId } = await params;
  const response = await getCollection(tasarimId);
  const collection = response.result;

  if (!response.success || !collection) notFound();

  const [cover, ...gallery] = collection.images;

  return (
    <main className="px-4 pb-16 pt-20 sm:px-6 sm:pt-24 lg:px-12 lg:pb-24 lg:pt-28">
      <div className="mt-6 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="m-0 min-w-0 break-words font-heading text-[clamp(58px,18vw,180px)] font-normal leading-[0.9] tracking-[-0.03em] lg:text-[clamp(90px,14vw,220px)]">
          {collection.title}
        </h1>
        <div className="shrink-0 text-xs uppercase tracking-[0.16em] text-main sm:pb-3 sm:text-right">
          {collection.category} — {collection.year}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:mt-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="relative aspect-3/4 min-w-0 overflow-hidden rounded-xs bg-[#f2ede412]">
          {cover && <Image src={cover.imageUrl} alt={`${collection.title} kapak görseli`} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />}
        </div>
        <div>
          <p className="m-0 mb-9 max-w-[56ch] text-pretty text-base leading-[1.7] text-[#f2ede4d9] sm:text-lg">{collection.detail}</p>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-7 gap-y-3.5 border-t border-[#f2ede426] pt-6 text-sm">
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede466]">Malzeme</span><span>{collection.material}</span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede466]">Kategori</span><span>{collection.category}</span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#f2ede466]">Yıl</span><span>{collection.year}</span>
          </div>
        </div>
      </div>

      {gallery.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((image, index) => (
            <div key={image.id} className="relative aspect-3/4 min-w-0 overflow-hidden rounded-xs bg-[#f2ede412]">
              <Image src={image.imageUrl} alt={`${collection.title} galeri görseli ${index + 1}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default TasarimPage;
