"use client";

import { useState } from "react";
import { Subtitle } from "@/lib/types";
import { transcribeVideo, getMockSubtitles } from "@/lib/transcriber";

interface TranscribeButtonProps {
  videoFile: File | null;
  onSubtitlesReady: (subtitles: Subtitle[]) => void;
  onError: (message: string) => void;
}

type Stage = "idle" | "extracting" | "uploading" | "transcribing" | "done";

export default function TranscribeButton({
  videoFile,
  onSubtitlesReady,
  onError,
}: TranscribeButtonProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const getButtonText = () => {
    if (isProcessing) {
      switch (stage) {
        case "extracting":
          return "Extracting audio...";
        case "uploading":
          return "Uploading...";
        case "transcribing":
          return "Transcribing...";
        default:
          return "Processing...";
      }
    }
    return "Generate Subtitles";
  };

  const handleTranscribe = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    setStage("extracting");
    setProgress(0);

    try {
      const subtitles = await transcribeVideo(videoFile, {
        onProgress: (s, p) => {
          setStage(s);
          if (p !== undefined) setProgress(p);
        },
      });

      setStage("done");
      onSubtitlesReady(subtitles);
    } catch (err) {
      console.error("Transcription error:", err);
      onError(err instanceof Error ? err.message : "Transcription failed");
    } finally {
      setIsProcessing(false);
      setStage("idle");
      setProgress(0);
    }
  };

  const handleMockSubtitles = () => {
    const mock = getMockSubtitles();
    onSubtitlesReady(mock);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <button
          onClick={handleTranscribe}
          disabled={!videoFile || isProcessing}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {getButtonText()}
        </button>
        <button
          onClick={handleMockSubtitles}
          disabled={isProcessing}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Use mock subtitles
        </button>
      </div>

      {isProcessing && stage !== "transcribing" && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {stage === "extracting" && "Extracting audio..."}
              {stage === "uploading" && "Uploading audio..."}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {isProcessing && stage === "transcribing" && (
        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm">Transcribing with AI...</span>
        </div>
      )}
    </div>
  );
}
