export interface Subtitle {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface VideoFile {
  file: File;
  url: string;
  duration: number;
}

export interface TranscriptionResult {
  subtitles: Subtitle[];
  duration: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface Transcriber {
  transcribe(videoUrl: string, duration: number): Promise<TranscriptionResult>;
}
