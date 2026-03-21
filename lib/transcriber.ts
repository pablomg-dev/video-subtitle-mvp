import { Transcriber, TranscriptionResult } from "./types";
import { MockTranscriber } from "./mockTranscriber";

// To use real Whisper transcription:
// 1. Install transformers.js: npm install @huggingface/transformers
// 2. Import WhisperTranscriber from mockTranscriber.ts
// 3. Replace MockTranscriber with WhisperTranscriber below

let transcriber: Transcriber = new MockTranscriber();

export async function transcribe(
  videoUrl: string,
  duration: number
): Promise<TranscriptionResult> {
  return transcriber.transcribe(videoUrl, duration);
}

export function setTranscriber(newTranscriber: Transcriber): void {
  transcriber = newTranscriber;
}

export type { Transcriber, TranscriptionResult };
