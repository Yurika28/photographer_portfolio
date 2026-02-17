import { getEventVideosByCategory } from "@/library/getEventVideos";
import ClientVideoGrid from "@/components/ClientVideoGrid";
import type { Category } from "@/library/getPhotos";

export default async function VideoList({
  category,
}: {
  category: Category;
}) {
  const videos = await getEventVideosByCategory(category);
  return <ClientVideoGrid videos={videos} />;
}
