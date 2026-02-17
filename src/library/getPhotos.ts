import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "event_files";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export type Category = "event" | "wedding" | "graduation";

export type Photo = {
  id: string;
  url: string;
  name: string;
  category: Category;
};

const categoryFolderMap: Record<Category, string> = {
  event: "Event",
  wedding: "Wedding",
  graduation: "Graduation",
};

function isImage(fileName: string) {
  return /\.(jpg|jpeg|png|webp)$/i.test(fileName);
}

export async function getPhotosByCategory(
  category: Category
): Promise<Photo[]> {
  const folder = categoryFolderMap[category];

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(`${folder}/foto`, {
      limit: 1000,
      offset: 0,
    });

  if (error) {
    console.error("Failed to fetch photos:", error.message);
    return [];
  }

  if (!data) return [];

  const mappedPhotos: Photo[] = data
    .filter((file) => {
      if (!file.name) return false;
      if (!file.metadata?.size) return false;
      if (!isImage(file.name)) return false;
      if (file.metadata.size > MAX_FILE_SIZE) return false;
      return true;
    })
    .map((file) => {
      const path = `${folder}/foto/${file.name}`;

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

      if (!publicUrlData?.publicUrl) return null;

      return {
        id: path,
        name: file.name,
        url: publicUrlData.publicUrl,
        category,
      };
    })
    .filter((photo): photo is Photo => photo !== null);

  // Deduplicate
  return Array.from(
    new Map(mappedPhotos.map((photo) => [photo.id, photo])).values()
  );
}
