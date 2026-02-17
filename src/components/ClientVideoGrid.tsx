"use client";

import VideoPlay from "./VideoPlay";
import type { VideoItem } from "@/library/getEventVideos";

export default function VideoGrid({
  videos,
}: {
  videos: VideoItem[];
}) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No videos found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {videos.map((video) => (
        <div
          key={video.id}
          className="aspect-video rounded-xl overflow-hidden shadow-md bg-black"
        >
          <VideoPlay video={video} />
        </div>
      ))}
    </div>
  );
}
