import { getEventVideosByCategory } from "@/library/getEventVideos";
import type { Category } from "@/library/getPhotos";
import VideoStrip from "@/components/VideoStrip";

export type Props = {
  videosPerSection?: number;
  rotate?: number;
};

export default async function CameraRoll({
  videosPerSection = 4,
  rotate = 0,
}: Props) {
  
  const categories: Category[] = ["event", "wedding", "graduation"];
  const results = await Promise.all(
    categories.map((category) => getEventVideosByCategory(category))
  );
  const videos = results.flat();

  const shuffled = videos
    .sort(() => Math.random() - 0.5)
    .slice(0, videosPerSection);

  return (
    <VideoStrip
      videos={shuffled}
      rotate={rotate}
      
    />
  );
}
