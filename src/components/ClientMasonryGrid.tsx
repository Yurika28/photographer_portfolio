import PhotoCard from "@/components/PhotoCard";
import type { Photo } from "@/library/getPhotos";


interface MasonryGridProps {
  photos: Photo[];
}

export default function MasonryGrid({ photos }: MasonryGridProps) {
  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4">
      <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.url}
            photo={photo}
          />
          ))}
      </div>
    </div>
  );
}
