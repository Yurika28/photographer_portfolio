

import { createClient } from '@supabase/supabase-js';
import type { Category } from "@/library/getPhotos";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CATEGORY_FOLDER_MAP: Record<Category, string> = {
  event: "Event",
  graduation: "Graduation",
  wedding: "Wedding",
};

export type VideoItem = {
  id: string;
  source: 'supabase';
  url: string;
  category: Category;
};

async function fetchStorageVideos(category: Category) {
  const folder = CATEGORY_FOLDER_MAP[category];
  const path = `${folder}/video`;

  const { data, error } = await supabase.storage
    .from('event_files')
    .list(path, {
      limit: 12,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

  if (error || !data) {
    console.error(`Error fetching ${folder} videos:`, error);
    return [];
  }

  return data
    .filter((file) => file.name.match(/\.(mp4|mov|webm|avi|mkv)$/i))
    .map((file) => ({
      id: `${folder}-${file.name}`,
      source: 'supabase' as const,
      category, // lowercase now
      url: supabase.storage
        .from('event_files')
        .getPublicUrl(`${path}/${file.name}`).data.publicUrl,
    }));
}

export async function getEventVideosByCategory(
  category: Category
): Promise<VideoItem[]> {
  return fetchStorageVideos(category);
}

