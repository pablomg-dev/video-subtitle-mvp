import { Subtitle } from "./types";
import { formatTime } from "./utils";

export function generateSRT(subtitles: Subtitle[]): string {
  return subtitles
    .map((subtitle, index) => {
      const startTime = formatTime(subtitle.start);
      const endTime = formatTime(subtitle.end);
      const text = subtitle.text.replace(/\n/g, " ");

      return `${index + 1}\n${startTime} --> ${endTime}\n${text}`;
    })
    .join("\n\n");
}

export function downloadSRT(subtitles: Subtitle[], filename: string = "subtitles.srt"): void {
  const srtContent = generateSRT(subtitles);
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
