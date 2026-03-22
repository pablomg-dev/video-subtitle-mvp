/**
 * Video Transcription Module
 * 
 * Uses FFmpeg.wasm to extract audio from video,
 * then sends to Groq API for transcription.
 */

import { Subtitle } from "./types";

export interface TranscribeOptions {
  onProgress?: (stage: "extracting" | "uploading" | "transcribing", pct?: number) => void;
  language?: string;
}

const API_URL = "/api/transcribe";
const MAX_DURATION = 300; // 5 minutes

function splitLongSubtitles(subtitles: Subtitle[]): Subtitle[] {
  const MAX_CHARS = 80;
  const result: Subtitle[] = [];
  let newId = 1;

  for (const sub of subtitles) {
    if (sub.text.length <= MAX_CHARS) {
      result.push({ ...sub, id: newId++ });
      continue;
    }

    const mid = Math.floor(sub.text.length / 2);
    let splitAt = -1;

    for (let i = 0; i <= 20; i++) {
      if (sub.text[mid + i] === " ") { splitAt = mid + i; break; }
      if (sub.text[mid - i] === " ") { splitAt = mid - i; break; }
    }

    if (splitAt === -1) splitAt = mid;

    const firstText = sub.text.slice(0, splitAt).trim();
    const secondText = sub.text.slice(splitAt).trim();
    const midTime = sub.start + (sub.end - sub.start) / 2;

    result.push({
      id: newId++,
      start: sub.start,
      end: midTime,
      text: firstText,
    });
    result.push({
      id: newId++,
      start: midTime,
      end: sub.end,
      text: secondText,
    });
  }

  return result;
}

export async function transcribeVideo(
  videoFile: File,
  options: TranscribeOptions = {}
): Promise<Subtitle[]> {
  const { onProgress, language } = options;

  if (typeof window === "undefined") {
    throw new Error("Transcription must run in browser");
  }

  onProgress?.("extracting", 0);

  const audioBlob = await extractAudio(videoFile, (pct) => {
    onProgress?.("extracting", pct);
  });

  onProgress?.("extracting", 100);
  onProgress?.("uploading", 0);

  const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });

  onProgress?.("transcribing", 0);

  const subtitles = await sendToApi(audioFile, language, (pct) => {
    onProgress?.("transcribing", pct);
  });

  return splitLongSubtitles(subtitles);
}

async function extractAudio(
  videoFile: File,
  onProgress: (pct: number) => void
): Promise<Blob> {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

  const ffmpeg = new FFmpeg();

  ffmpeg.on("progress", ({ progress }) => {
    onProgress(Math.round(progress * 80));
  });

  onProgress(10);

  const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  onProgress(30);

  await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

  onProgress(40);

  await ffmpeg.exec([
    "-i", "input.mp4",
    "-vn",
    "-acodec", "pcm_s16le",
    "-ar", "16000",
    "-ac", "1",
    "-t", MAX_DURATION.toString(),
    "-af", "aresample=async=1",
    "-avoid_negative_ts", "make_zero",
    "-fflags", "+genpts",
    "output.wav",
  ]);

  onProgress(90);

  const data = await ffmpeg.readFile("output.wav");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = new Blob([data as any], { type: "audio/wav" });

  await ffmpeg.deleteFile("input.mp4");
  await ffmpeg.deleteFile("output.wav");

  return blob;
}

async function sendToApi(
  audioFile: File,
  language: string | undefined,
  onProgress: (pct: number) => void
): Promise<Subtitle[]> {
  const formData = new FormData();
  formData.append("audio", audioFile);
  if (language) {
    formData.append("language", language);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  onProgress(100);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(error.error || "Transcription failed");
  }

  const result = await response.json();
  return result.subtitles;
}
