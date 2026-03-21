"use client";

import { useState, useEffect, useCallback } from "react";
import Upload from "../components/Upload";
import VideoPlayer from "../components/VideoPlayer";
import SubtitleEditor from "../components/SubtitleEditor";
import { Subtitle, VideoFile } from "../lib/types";
import { MockTranscriber } from "../lib/mockTranscriber";
import { downloadSRT } from "../lib/srtExporter";
import { checkDevicePerformance } from "../lib/validators";

export default function Home() {
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSlowDeviceWarning, setShowSlowDeviceWarning] = useState(false);

  useEffect(() => {
    if (checkDevicePerformance() === false) {
      setShowSlowDeviceWarning(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (videoFile?.url) {
        URL.revokeObjectURL(videoFile.url);
      }
    };
  }, [videoFile]);

  const handleFileSelect = useCallback((file: File, duration: number) => {
    // Clean up previous video URL
    if (videoFile?.url) {
      URL.revokeObjectURL(videoFile.url);
    }

    const url = URL.createObjectURL(file);
    setVideoFile({ file, url, duration });
    setSubtitles([]);
    setError(null);
  }, [videoFile]);

  const handleError = useCallback((message: string) => {
    setError(message);
  }, []);

  const handleGenerateSubtitles = useCallback(async () => {
    if (!videoFile) return;

    setIsTranscribing(true);
    setError(null);

    try {
      const transcriber = new MockTranscriber();
      const result = await transcriber.transcribe(videoFile.url, videoFile.duration);
      setSubtitles(result.subtitles);
    } catch (err) {
      setError("Failed to generate subtitles. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  }, [videoFile]);

  const handleExportSRT = useCallback(() => {
    if (subtitles.length === 0) return;

    const filename = videoFile
      ? videoFile.file.name.replace(/\.[^/.]+$/, "") + ".srt"
      : "subtitles.srt";

    downloadSRT(subtitles, filename);
  }, [subtitles, videoFile]);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Video Subtitle MVP
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a video, generate subtitles, edit, and export as SRT
          </p>
        </div>

        {showSlowDeviceWarning && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-200 text-sm">
            Warning: Your device may be slow for transcription. Consider using a
            device with more cores for better performance.
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            1. Upload Video
          </h2>
          <Upload onFileSelect={handleFileSelect} onError={handleError} />
        </section>

        {videoFile && (
          <>
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                2. Video Preview
              </h2>
              <VideoPlayer
                videoUrl={videoFile.url}
                subtitles={subtitles}
                onTimeUpdate={handleTimeUpdate}
              />
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  3. Generate Subtitles
                </h2>
                <button
                  onClick={handleGenerateSubtitles}
                  disabled={isTranscribing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isTranscribing ? "Generating..." : "Generate Subtitles"}
                </button>
              </div>
            </section>

            {subtitles.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    4. Edit Subtitles
                  </h2>
                  <button
                    onClick={handleExportSRT}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Download SRT
                  </button>
                </div>
                <SubtitleEditor
                  subtitles={subtitles}
                  onChange={setSubtitles}
                  currentTime={currentTime}
                />
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
