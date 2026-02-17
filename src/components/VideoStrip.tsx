"use client";

import { useEffect, useState } from "react";
import type { VideoItem } from "@/library/getEventVideos";
import VideoPlay from "./VideoPlay";

type Props = {
  videos: VideoItem[];
  rotate: number;
};

export default function VideoStrip({ videos, rotate }: Props) {
  const [indicatorCount, setIndicatorCount] = useState(24);
  const [videosPerSection, setVideosPerSection] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;

      setIndicatorCount(isMobile ? 12 : 24);
      setVideosPerSection(isMobile ? 2 : 4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleVideos = videos.slice(0, videosPerSection);

  return (
    <div
      className="flex flex-col justify-between h-[250px] md:h-[350px] w-[125%] -ml-[5.5%] bg-black py-4 my-10"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
     
      <div className="flex w-full justify-around overflow-hidden">
        {Array.from({ length: indicatorCount }).map((_, i) => (
          <div
            key={i}
            className="h-5 w-5 md:h-7 md:w-7 rounded-full bg-amber-50"
          />
        ))}
      </div>

    
      <div className="flex gap-2 sm:gap-5 md:gap-8 ">
        {visibleVideos.length > 0 ? (
          visibleVideos.map((video) => (
            <div
              key={video.id}
              className="h-[155px] md:h-[240px] w-1/2 md:w-full max-w-[320px]"
            >
              <VideoPlay video={video} />
            </div>
          ))
        ) : (
          <p className="text-white">No videos found</p>
        )}
      </div>


      <div className="flex w-full justify-around overflow-hidden">
        {Array.from({ length: indicatorCount }).map((_, i) => (
          <div
            key={i}
            className="h-5 w-5 md:h-7 md:w-7 rounded-full bg-amber-50"
          />
        ))}
      </div>
    </div>
  );
}
