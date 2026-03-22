import { Subtitle } from "./types";
import { formatTime } from "./utils";

export function generateSRT(subtitles: Subtitle[], offsetSeconds: number = 0): string {
  return subtitles
    .map((subtitle, index) => {
      const startTime = formatTime(Math.max(0, subtitle.start + offsetSeconds));
      const endTime = formatTime(Math.max(0, subtitle.end + offsetSeconds));
      const text = subtitle.text.replace(/\n/g, " ");

      return `${index + 1}\n${startTime} --> ${endTime}\n${text}`;
    })
    .join("\n\n");
}

export function downloadSRT(subtitles: Subtitle[], filename: string = "subtitles.srt", offsetSeconds: number = 0): void {
  const srtContent = generateSRT(subtitles, offsetSeconds);
  const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
