export interface Subtitle {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface SubtitleStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  bgColor: string;
  bgOpacity: number;
  bold: boolean;
  position: "bottom" | "middle" | "top";
}

export const defaultSubtitleStyle: SubtitleStyle = {
  fontFamily: "Arial",
  fontSize: 24,
  color: "#ffffff",
  bgColor: "#000000",
  bgOpacity: 0.6,
  bold: false,
  position: "bottom",
};

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
