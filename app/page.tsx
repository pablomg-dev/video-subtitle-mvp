"use client";

import { useState, useEffect, useCallback } from "react";
import Upload from "../components/Upload";
import VideoPlayer from "../components/VideoPlayer";
import SubtitleEditor from "../components/SubtitleEditor";
import TranscribeButton from "../components/TranscribeButton";
import { Subtitle, VideoFile, defaultSubtitleStyle } from "../lib/types";
import { checkDevicePerformance } from "../lib/validators";

export default function Home() {
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [subtitleStyle, setSubtitleStyle] = useState(defaultSubtitleStyle);
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

  const handleSubtitlesReady = useCallback((newSubtitles: Subtitle[]) => {
    setSubtitles(newSubtitles);
  }, []);

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
            Upload a video, generate subtitles with AI, edit, and export as SRT
          </p>
        </div>

        {showSlowDeviceWarning && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-200 text-sm">
            Warning: Your device may be slow. Try using mock subtitles for testing.
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
                style={subtitleStyle}
                onTimeUpdate={handleTimeUpdate}
              />
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                3. Generate Subtitles
              </h2>
              <TranscribeButton
                videoFile={videoFile.file}
                onSubtitlesReady={handleSubtitlesReady}
                onError={handleError}
              />
            </section>

            {subtitles.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  4. Edit Subtitles
                </h2>
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
