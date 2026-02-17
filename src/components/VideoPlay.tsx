"use client";

import type { VideoItem } from "@/library/getEventVideos";

type VideoPlayProps = {
  video: VideoItem;
};

export default function VideoPlay({ video }: VideoPlayProps) {
  return (
    <video
      src={video.url}
      controls
      preload="metadata"
      playsInline
      muted
      controlsList="nodownload"
      className="w-full h-full object-cover"
      onDoubleClick={(e) => {
        const videoEl = e.currentTarget;
        if (videoEl.requestFullscreen) {
          videoEl.requestFullscreen();
        }
      }}
    />
  );
}
