import { Subtitle, TranscriptionResult, Transcriber } from "./types";

const MOCK_SUBTITLES: Subtitle[] = [
  { id: 1, start: 0.0, end: 2.5, text: "Welcome to this video tutorial." },
  { id: 2, start: 2.5, end: 5.0, text: "Today we will learn about automatic subtitling." },
  { id: 3, start: 5.0, end: 8.5, text: "This is a demo using a mock transcription system." },
  { id: 4, start: 8.5, end: 12.0, text: "In a real implementation, Whisper would generate these subtitles." },
  { id: 5, start: 12.0, end: 15.5, text: "You can edit any subtitle text here before exporting." },
  { id: 6, start: 15.5, end: 19.0, text: "The app will generate a valid SRT file for download." },
];

export class MockTranscriber implements Transcriber {
  async transcribe(videoUrl: string, duration: number): Promise<TranscriptionResult> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Generate subtitles based on actual video duration
    const subtitles = this.generateSubtitles(duration);

    return {
      subtitles,
      duration,
    };
  }

  private generateSubtitles(duration: number): Subtitle[] {
    // If video is shorter than our mock, truncate
    if (duration <= 5) {
      return MOCK_SUBTITLES.filter((s) => s.end <= duration).map((s, i) => ({
        ...s,
        id: i + 1,
      }));
    }

    // Scale mock subtitles to fit video duration
    const scale = duration / MOCK_SUBTITLES[MOCK_SUBTITLES.length - 1].end;
    return MOCK_SUBTITLES.map((subtitle, index) => ({
      ...subtitle,
      id: index + 1,
      start: subtitle.start * scale,
      end: Math.min(subtitle.end * scale, duration),
    }));
  }
}

// Placeholder for real Whisper implementation
export class WhisperTranscriber implements Transcriber {
  async transcribe(videoUrl: string, duration: number): Promise<TranscriptionResult> {
    // TODO: Implement real Whisper transcription using transformers.js
    // 1. Extract audio from video
    // 2. Load Whisper model (tiny/base)
    // 3. Run inference
    // 4. Convert output to Subtitle[] format

    throw new Error("Whisper transcription not yet implemented. Use MockTranscriber for testing.");
  }
}
