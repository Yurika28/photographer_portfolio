import Image from "next/image";
import type { Photo } from "@/library/getPhotos";


export default function PhotoCard({ photo }: { photo: Photo }) {
  return (
    <div className="mb-4 break-inside-avoid group relative overflow-hidden rounded-xl">
      <Image
        src={photo.url}
        alt={`${photo.category} - ${photo.id}`}
        width={600}
        height={800}
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        sizes="(max-width: 640px) 100vw,
               (max-width: 1024px) 50vw,
               25vw"
        quality={75}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
        <div className="w-full p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition">
          <p className="text-white text-sm font-medium truncate">
            {photo.category}
          </p>
        </div>
      </div>
    </div>
  );
}
