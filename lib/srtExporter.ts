import { Subtitle } from "./types";
import { formatTime } from "./utils";

const MAX_LINE_LENGTH = 40;

function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapLines(text: string): string {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length > MAX_LINE_LENGTH && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join("\n");
}

export function generateSRT(subtitles: Subtitle[], offsetSeconds: number = 0): string {
  return subtitles
    .map((subtitle, index) => {
      const startTime = formatTime(Math.max(0, subtitle.start + offsetSeconds));
      const endTime = formatTime(Math.max(0, subtitle.end + offsetSeconds));
      const text = wrapLines(cleanText(subtitle.text));

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
