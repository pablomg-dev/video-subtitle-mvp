import { Subtitle, TranscriptionResult, Transcriber } from "./types";

const MOCK_SUBTITLES: Subtitle[] = [
  { id: 1, start: 0.0, end: 2.5, text: "Welcome to this video tutorial." },
  { id: 2, start: 2.5, end: 5.0, text: "Today we will learn about automatic subtitling." },
  { id: 3, start: 5.0, end: 8.5, text: "This is a demo using mock transcription." },
  { id: 4, start: 8.5, end: 12.0, text: "Enable mock mode in the UI to use this." },
  { id: 5, start: 12.0, end: 15.5, text: "Use real Whisper for actual transcription." },
  { id: 6, start: 15.5, end: 19.0, text: "The app will generate a valid SRT file for download." },
];

export class MockTranscriber implements Transcriber {
  async transcribe(videoUrl: string, duration: number): Promise<TranscriptionResult> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

    const subtitles = this.generateSubtitles(duration);

    return {
      subtitles,
      duration,
    };
  }

  private generateSubtitles(duration: number): Subtitle[] {
    if (duration <= 5) {
      return MOCK_SUBTITLES.filter((s) => s.end <= duration).map((s, i) => ({
        ...s,
        id: i + 1,
      }));
    }

    const scale = duration / MOCK_SUBTITLES[MOCK_SUBTITLES.length - 1].end;
    return MOCK_SUBTITLES.map((subtitle, index) => ({
      ...subtitle,
      id: index + 1,
      start: subtitle.start * scale,
      end: Math.min(subtitle.end * scale, duration),
    }));
  }
}
