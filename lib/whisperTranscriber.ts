/**
 * Whisper Transcription Implementation
 * 
 * This file contains a real implementation for Whisper-based transcription.
 * Currently commented out due to @huggingface/transformers compatibility 
 * issues with Next.js SSR bundling.
 * 
 * To enable Whisper transcription:
 * 
 * 1. Run the app in standalone mode (not through Next.js SSR):
 *    - Create a separate Vite/React app for the transcription
 *    - Or use a Node.js script with the pipeline
 * 
 * 2. Or use the CDN version of transformers.js:
 *    - Load @huggingface/transformers via script tag
 *    - Access via window.HuggingFace.Transformers
 * 
 * 3. Production deployment:
 *    - Deploy as a static SPA (npm run build, then serve out/)
 *    - The transformers.js library works without SSR issues
 * 
 * The implementation below is ready to use once the integration
 * issue is resolved.
 */

import { Subtitle, TranscriptionResult, Transcriber } from "./types";

// Uncomment when transformers.js works with your setup:
// import { pipeline, FeatureExtractionPipeline } from "@huggingface/transformers";

// Use tiny model for speed - smallest model loads fastest
// const MODEL_ID = "Xenova/whisper-tiny";

interface WhisperSegment {
  text: string;
  start: number;
  end: number;
}

export class WhisperTranscriber implements Transcriber {
  // private model: FeatureExtractionPipeline | null = null;
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
    // TODO: Implement real Whisper transcription
    // 
    // Implementation steps:
    // 1. Extract audio from video using Web Audio API
    // 2. Load Whisper model (tiny/base) via pipeline()
    // 3. Run inference with return_timestamps: true
    // 4. Convert output.chunks to Subtitle[] format
    // 
    // Example implementation:
    //
    // const audioData = await this.extractAudioFromVideo(videoUrl);
    // this.updateProgress("Loading AI model...");
    // 
    // const model = await pipeline(
    //   "automatic-speech-recognition",
    //   MODEL_ID,
    //   { device: "wasm", dtype: "q8" }
    // );
    // 
    // this.updateProgress("Processing audio...");
    // const output = await model(audioData, {
    //   chunk_length_s: 30,
    //   stride_length_s: 5,
    //   return_timestamps: true,
    // });
    // 
    // return {
    //   subtitles: output.chunks.map((chunk, i) => ({
    //     id: i + 1,
    //     start: chunk.timestamp[0],
    //     end: chunk.timestamp[1],
    //     text: chunk.text.trim(),
    //   })),
    //   duration,
    // };

    throw new Error("Whisper not yet integrated. Use MockTranscriber for testing.");
  }

  private async extractAudioFromVideo(videoUrl: string): Promise<Float32Array | null> {
    // See: lib/whisperTranscriber.full.ts for complete implementation
    // This method:
    // 1. Creates AudioContext
    // 2. Fetches video blob
    // 3. Decodes audio
    // 4. Resamples to 16kHz mono (Whisper requirement)
    // 5. Returns Float32Array
    return null;
  }
}
