"use client";

import { useState, useEffect, useCallback } from "react";
import Upload from "../components/Upload";
import VideoPlayer from "../components/VideoPlayer";
import SubtitleEditor from "../components/SubtitleEditor";
import TranscribeButton from "../components/TranscribeButton";
import Timeline from "../components/Timeline";
import { Subtitle, VideoFile } from "../lib/types";
import { checkDevicePerformance } from "../lib/validators";
import { downloadSRT } from "../lib/srtExporter";

const SUBTITLE_STYLE = {
  fontFamily: "Arial",
  fontSize: 22,
  color: "#ffffff",
  bgColor: "#000000",
  bgOpacity: 0.65,
  bold: false,
  position: "bottom" as const,
};

export default function Home() {
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTo, setSeekTo] = useState<number | undefined>(undefined);
  const [highlightedSubId, setHighlightedSubId] = useState<number | null>(null);
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

  const handleFileSelect = useCallback((file: File, d: number) => {
    if (videoFile?.url) {
      URL.revokeObjectURL(videoFile.url);
    }

    const url = URL.createObjectURL(file);
    setVideoFile({ file, url, duration: d });
    setSubtitles([]);
    setError(null);
    setDuration(0);
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

  const handleDurationChange = useCallback((d: number) => {
    setDuration(d);
  }, []);

  const handleSeek = useCallback((time: number) => {
    setSeekTo(time);
    setTimeout(() => setSeekTo(undefined), 100);
  }, []);

  const handleSubtitleClick = useCallback((id: number) => {
    setHighlightedSubId(id);
    const sub = subtitles.find((s) => s.id === id);
    if (sub) {
      handleSeek(sub.start);
    }
  }, [subtitles, handleSeek]);

  const handleDownloadSRT = useCallback(() => {
    downloadSRT(subtitles);
  }, [subtitles]);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
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
          <div className="flex gap-4" style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ flex: "0 0 62%" }}>
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  2. Video Preview
                </h2>
                <VideoPlayer
                  videoUrl={videoFile.url}
                  subtitles={subtitles}
                  style={SUBTITLE_STYLE}
                  seekTo={seekTo}
                  onTimeUpdate={handleTimeUpdate}
                  onDurationChange={handleDurationChange}
                />
              </section>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <section className="space-y-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  3. Generar Subtítulos
                </h2>
                <TranscribeButton
                  videoFile={videoFile.file}
                  onSubtitlesReady={handleSubtitlesReady}
                  onError={handleError}
                />
              </section>

              {subtitles.length > 0 && (
                <>
                  <section className="space-y-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Línea de tiempo
                    </h2>
                    <Timeline
                      subtitles={subtitles}
                      currentTime={currentTime}
                      duration={duration}
                      onSeek={handleSeek}
                      onSubtitleClick={handleSubtitleClick}
                    />
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      4. Editar Subtítulos
                    </h2>
                    <SubtitleEditor
                      subtitles={subtitles}
                      onChange={setSubtitles}
                      currentTime={currentTime}
                      highlightedId={highlightedSubId}
                    />

                    <button
                      onClick={handleDownloadSRT}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Descargar SRT
                    </button>
                  </section>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
