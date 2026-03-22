"use client";

import { useRef, useEffect } from "react";
import { Subtitle, SubtitleStyle, defaultSubtitleStyle } from "../lib/types";

interface VideoPlayerProps {
  videoUrl: string;
  subtitles: Subtitle[];
  style?: SubtitleStyle;
  offsetSeconds?: number;
  onTimeUpdate?: (time: number) => void;
}

export default function VideoPlayer({
  videoUrl,
  subtitles,
  style = defaultSubtitleStyle,
  offsetSeconds = 0,
  onTimeUpdate,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef(-1);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = Math.floor(width);
        canvas.height = Math.floor(height);
      }
    });

    resizeObserver.observe(video);

    const render = () => {
      const currentTime = video.currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentTime === lastTimeRef.current) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }
      lastTimeRef.current = currentTime;

      onTimeUpdate?.(currentTime);

      const active = subtitles.find(s => {
        const start = s.start + offsetSeconds + 0.05;
        const end = s.end + offsetSeconds;
        return currentTime >= start && currentTime < end;
      });

      if (active) {
        drawSubtitle(ctx, canvas, active.text, style);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [subtitles, style, offsetSeconds, onTimeUpdate]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-black rounded-lg overflow-hidden relative inline-block"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full aspect-video block"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawSubtitle(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  text: string,
  style: SubtitleStyle
) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const scaledFontSize = Math.round(style.fontSize * canvasWidth / 640);

  const sidePadding = Math.round(canvasWidth * 0.05);
  const maxTextWidth = canvasWidth - sidePadding * 2;

  const tempPad = Math.round(scaledFontSize * 0.5);
  const tempLines = wrapText(ctx, text, maxTextWidth - tempPad * 2);

  let finalFontSize = scaledFontSize;
  if (tempLines.length >= 3) {
    finalFontSize = Math.round(scaledFontSize * 0.75);
  } else if (tempLines.length === 2) {
    finalFontSize = Math.round(scaledFontSize * 0.9);
  }

  ctx.font = `${style.bold ? "bold" : "normal"} ${finalFontSize}px ${style.fontFamily}`;

  const finalLines = wrapText(ctx, text, maxTextWidth - tempPad * 2);
  const hPadFinal = Math.round(finalFontSize * 0.5);
  const vPadFinal = Math.round(finalFontSize * 0.3);
  const lineHeightFinal = Math.round(finalFontSize * 1.35);

  const boxWidth = Math.min(
    Math.max(...finalLines.map((l) => ctx.measureText(l).width)) + hPadFinal * 2,
    maxTextWidth
  );
  const boxHeight = finalLines.length * lineHeightFinal + vPadFinal * 2;

  let boxY: number;
  if (style.position === "top") {
    boxY = Math.round(canvasHeight * 0.05);
  } else if (style.position === "middle") {
    boxY = Math.round((canvasHeight - boxHeight) / 2);
  } else {
    boxY = Math.round(canvasHeight * 0.95 - boxHeight);
  }

  const boxX = Math.round((canvasWidth - boxWidth) / 2);

  const hex = style.bgColor;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  ctx.fillStyle = `rgba(${r},${g},${b},${style.bgOpacity})`;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 4);
  ctx.fill();

  ctx.fillStyle = style.color;
  ctx.textBaseline = "top";
  finalLines.forEach((line, i) => {
    const lineWidth = ctx.measureText(line).width;
    const lineX = boxX + (boxWidth - lineWidth) / 2;
    const lineY = boxY + vPadFinal + i * lineHeightFinal;
    ctx.fillText(line, lineX, lineY);
  });
}
