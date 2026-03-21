import { ValidationResult } from "./types";

const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_DURATION = 5 * 60; // 5 minutes in seconds

export function validateVideoFile(file: File): ValidationResult {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Please upload a video file (MP4, WebM, or MOV)",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File size must be under 50MB",
    };
  }

  return { valid: true };
}

export function validateDuration(duration: number): ValidationResult {
  if (duration > MAX_DURATION) {
    return {
      valid: false,
      error: "Video must be 5 minutes or shorter",
    };
  }

  return { valid: true };
}

export function checkDevicePerformance(): boolean {
  if (typeof navigator === "undefined") return true;
  const cores = navigator.hardwareConcurrency || 4;
  return cores >= 4;
}

export function getAcceptedFileTypes(): string {
  return ACCEPTED_TYPES.join(",");
}
