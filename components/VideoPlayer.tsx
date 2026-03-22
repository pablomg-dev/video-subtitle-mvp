"use client";

import { useRef, useEffect, useState } from "react";
import { Subtitle, SubtitleStyle, defaultSubtitleStyle } from "../lib/types";

interface VideoPlayerProps {
  videoUrl: string;
  subtitles: Subtitle[];
  style?: SubtitleStyle;
  seekTo?: number;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export default function VideoPlayer({
  videoUrl,
  subtitles,
  style = defaultSubtitleStyle,
  seekTo,
  onTimeUpdate,
  onDurationChange,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSub, setActiveSub] = useState<Subtitle | null>(null);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    setActiveSub(null);
  }, [subtitles]);

  useEffect(() => {
    if (seekTo !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTo;
    }
  }, [seekTo]);

  const getOverlayStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      padding: "0 5%",
      pointerEvents: "none",
    };

    if (style.position === "top") {
      return { ...baseStyle, top: "8px", bottom: "auto" };
    } else if (style.position === "middle") {
      return {
        ...baseStyle,
        top: "50%",
        transform: "translateY(-50%)",
        bottom: "auto",
      };
    } else {
      return { ...baseStyle, bottom: "52px" };
    }
  };

  const getFontSize = () => {
    if (isVertical) {
      return `clamp(10px, ${style.fontSize * 0.06}vh, ${style.fontSize}px)`;
    }
    return `clamp(12px, ${style.fontSize * 0.045}vw + 6px, ${style.fontSize * 1.5}px)`;
  };

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden relative inline-block">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full aspect-video block"
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setIsVertical(
              (videoRef.current.videoHeight ?? 0) >
                (videoRef.current.videoWidth ?? 1)
            );
            onDurationChange?.(videoRef.current.duration);
          }
        }}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          onTimeUpdate?.(t);
          const found =
            subtitles.find(
              (s) => t >= s.start + 0.05 && t < s.end
            ) ?? null;
          setActiveSub((prev) => (prev?.id === found?.id ? prev : found));
        }}
      />
      <div style={getOverlayStyle()}>
        <div
          style={{
            fontFamily: style.fontFamily,
            fontSize: getFontSize(),
            fontWeight: style.bold ? "bold" : "normal",
            color: style.color,
            backgroundColor: hexToRgba(style.bgColor, style.bgOpacity),
            padding: "0.3em 0.6em",
            borderRadius: "4px",
            textAlign: "center",
            maxWidth: "90%",
            lineHeight: 1.35,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            opacity: activeSub ? 1 : 0,
            transition: "opacity 0.15s ease",
          }}
        >
          {activeSub?.text ?? ""}
        </div>
      </div>
    </div>
  );
}
