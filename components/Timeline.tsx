"use client";

import { Subtitle } from "../lib/types";

interface TimelineProps {
  subtitles: Subtitle[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onSubtitleClick: (id: number) => void;
}

export default function Timeline({
  subtitles,
  currentTime,
  duration,
  onSeek,
  onSubtitleClick,
}: TimelineProps) {
  if (duration <= 0) {
    return (
      <div
        className="w-full h-16 rounded bg-gray-900 flex items-center justify-center text-gray-500 text-sm"
      >
        No hay video cargado
      </div>
    );
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const time = pct * duration;
    onSeek(Math.max(0, Math.min(duration, time)));
  };

  const playheadPct = (currentTime / duration) * 100;

  return (
    <div className="w-full">
      <div
        onClick={handleTimelineClick}
        className="relative w-full h-16 rounded-lg overflow-hidden cursor-pointer select-none"
        style={{ backgroundColor: "#1a1a2e" }}
      >
        {subtitles.map((sub) => {
          const left = (sub.start / duration) * 100;
          const width = ((sub.end - sub.start) / duration) * 100;
          return (
            <div
              key={sub.id}
              onClick={(e) => {
                e.stopPropagation();
                onSubtitleClick(sub.id);
              }}
              className="absolute top-1 bottom-1 rounded flex items-center px-1 overflow-hidden cursor-pointer transition-opacity hover:opacity-80"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: "rgba(139, 92, 246, 0.6)",
                border: "1px solid rgba(139, 92, 246, 0.8)",
              }}
              title={sub.text}
            >
              {width > 8 && (
                <span
                  className="text-white text-xs truncate"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                >
                  {sub.text}
                </span>
              )}
            </div>
          );
        })}

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none"
          style={{ left: `${playheadPct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
        <span>{formatTimeShort(0)}</span>
        <span>{formatTimeShort(duration)}</span>
      </div>
    </div>
  );
}

function formatTimeShort(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
