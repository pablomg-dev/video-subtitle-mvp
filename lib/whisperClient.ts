"use client";

/**
 * Client-only Whisper Transcription Module
 * 
 * This file MUST only be loaded dynamically on the client side.
 * It imports @huggingface/transformers which has WASM dependencies
 * incompatible with Next.js SSR bundling.
 */

import { Subtitle, TranscriptionResult, Transcriber } from "./types";

const MODEL_ID = "Xenova/whisper-tiny";

export class WhisperTranscriber implements Transcriber {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private model: any = null;
  private progressCallback: ((status: string) => void) | null = null;

  setProgressCallback(callback: (status: string) => void) {
    this.progressCallback = callback;
  }

  private updateProgress(status: string) {
    if (this.progressCallback) {
      this.progressCallback(status);
    }
  }

  async transcribe(videoUrl: string, duration: number): Promise<TranscriptionResult> {
    try {
      this.updateProgress("Extracting audio...");
      const audioData = await this.extractAudioFromVideo(videoUrl);
      
      if (!audioData) {
        throw new Error("Failed to extract audio from video");
      }

      this.updateProgress("Loading AI model... This may take 30-60 seconds on first run.");
      
      const { pipeline } = await import("@huggingface/transformers");
      
      if (!this.model) {
        this.model = await pipeline(
          "automatic-speech-recognition",
          MODEL_ID,
          {
            device: "wasm",
            dtype: "q8",
          }
        );
      }

      this.updateProgress("Processing audio...");
      
      const output = await this.model(audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: true,
      });

      const subtitles = this.convertToSubtitles(output, duration);

      return {
        subtitles,
        duration,
      };
    } catch (error) {
      console.error("Whisper transcription error:", error);
      throw error;
    }
  }

  private async extractAudioFromVideo(videoUrl: string): Promise<Float32Array | null> {
    return new Promise((resolve) => {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      
      audio.onloadedmetadata = async () => {
        try {
          const response = await fetch(videoUrl);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          const monoData = this.convertToMono16kHz(audioBuffer);
          audioContext.close();
          resolve(monoData);
        } catch (error) {
          console.error("Audio extraction error:", error);
          audioContext.close();
          resolve(null);
        }
      };

      audio.onerror = () => {
        console.error("Audio load error");
        audioContext.close();
        resolve(null);
      };

      audio.src = videoUrl;
      audio.load();
    });
  }

  private convertToMono16kHz(audioBuffer: AudioBuffer): Float32Array {
    const source = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const targetSampleRate = 16000;
    const ratio = sampleRate / targetSampleRate;
    const targetLength = Math.floor(source.length / ratio);
    const result = new Float32Array(targetLength);

    for (let i = 0; i < targetLength; i++) {
      const srcIndex = i * ratio;
      const srcIndexFloor = Math.floor(srcIndex);
      const srcIndexCeil = Math.min(srcIndexFloor + 1, source.length - 1);
      const fraction = srcIndex - srcIndexFloor;
      result[i] = source[srcIndexFloor] * (1 - fraction) + source[srcIndexCeil] * fraction;
    }

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private convertToSubtitles(output: any, duration: number): Subtitle[] {
    const chunks = output?.chunks;
    
    if (chunks && Array.isArray(chunks) && chunks.length > 0) {
      return chunks.map((chunk: { text?: string; start?: number; end?: number }, index: number) => ({
        id: index + 1,
        start: chunk.start ?? 0,
        end: chunk.end ?? 0,
        text: (chunk.text ?? "").trim(),
      }));
    }

    const text = (output?.text ?? "").trim();
    if (!text) return [];

    const sentences = text.split(/(?<=[.!?])\s+/).filter((s: string) => s.trim());
    
    if (sentences.length === 0) {
      return [{
        id: 1,
        start: 0,
        end: Math.min(duration, 5),
        text: text,
      }];
    }

    const avgDuration = duration / sentences.length;
    
    return sentences.map((sentence: string, index: number) => ({
      id: index + 1,
      start: index * avgDuration,
      end: Math.min((index + 1) * avgDuration, duration),
      text: sentence.trim(),
    }));
  }
}
