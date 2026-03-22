/**
 * Video Transcription Module
 * 
 * Uses FFmpeg.wasm to extract audio from video,
 * then sends to Groq API for transcription.
 */

import { Subtitle } from "./types";

export interface TranscribeOptions {
  onProgress?: (stage: "extracting" | "uploading" | "transcribing", pct?: number) => void;
}

const API_URL = "/api/transcribe";
const MAX_DURATION = 300; // 5 minutes

export async function transcribeVideo(
  videoFile: File,
  options: TranscribeOptions = {}
): Promise<Subtitle[]> {
  const { onProgress } = options;

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

  const subtitles = await sendToApi(audioFile, (pct) => {
    onProgress?.("transcribing", pct);
  });

  return subtitles;
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

  await ffmpeg.writeFile("input", await fetchFile(videoFile));

  onProgress(40);

  await ffmpeg.exec([
    "-i", "input",
    "-ar", "16000",
    "-ac", "1",
    "-t", MAX_DURATION.toString(),
    "-f", "wav",
    "output.wav",
  ]);

  onProgress(90);

  const data = await ffmpeg.readFile("output.wav");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = new Blob([data as any], { type: "audio/wav" });

  await ffmpeg.deleteFile("input");
  await ffmpeg.deleteFile("output.wav");

  return blob;
}

async function sendToApi(
  audioFile: File,
  onProgress: (pct: number) => void
): Promise<Subtitle[]> {
  const formData = new FormData();
  formData.append("audio", audioFile);

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
