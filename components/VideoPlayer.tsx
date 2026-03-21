"use client";

import { useRef, useEffect } from "react";
import { Subtitle } from "../lib/types";

interface VideoPlayerProps {
  videoUrl: string;
  subtitles: Subtitle[];
  onTimeUpdate?: (time: number) => void;
}

export default function VideoPlayer({ videoUrl, subtitles, onTimeUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [onTimeUpdate]);

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full aspect-video"
      />
    </div>
  );
}
