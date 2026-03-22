"use client";

import { useRef, useEffect, useState } from "react";
import { Subtitle, SubtitleStyle, defaultSubtitleStyle } from "../lib/types";

interface VideoPlayerProps {
  videoUrl: string;
  subtitles: Subtitle[];
  style?: SubtitleStyle;
  offsetSeconds?: number;
  onTimeUpdate?: (time: number) => void;
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
  offsetSeconds = 0,
  onTimeUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSub, setActiveSub] = useState<Subtitle | null>(null);

  useEffect(() => {
    setActiveSub(null);
  }, [subtitles]);

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

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden relative inline-block">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full aspect-video block"
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          onTimeUpdate?.(t);
          const found =
            subtitles.find(
              (s) =>
                t >= s.start + offsetSeconds + 0.05 &&
                t < s.end + offsetSeconds
            ) ?? null;
          setActiveSub((prev) => (prev?.id === found?.id ? prev : found));
        }}
      />
      <div style={getOverlayStyle()}>
        <div
          style={{
            fontFamily: style.fontFamily,
            fontSize: `clamp(14px, ${
              style.fontSize * 0.045
            }vw + 8px, ${style.fontSize * 2}px)`,
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
