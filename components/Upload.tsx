"use client";

import { useCallback, useState } from "react";
import { validateVideoFile, validateDuration, getAcceptedFileTypes } from "../lib/validators";
import { formatFileSize } from "../lib/utils";

interface UploadProps {
  onFileSelect: (file: File, duration: number) => void;
  onError: (message: string) => void;
}

export default function Upload({ onFileSelect, onError }: UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      const validation = validateVideoFile(file);
      if (!validation.valid) {
        onError(validation.error || "Invalid file");
        return;
      }

      setSelectedFile(file);

      // Get video duration
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const durationValidation = validateDuration(video.duration);
        if (!durationValidation.valid) {
          setSelectedFile(null);
          onError(durationValidation.error || "Video too long");
          URL.revokeObjectURL(video.src);
          return;
        }

        URL.revokeObjectURL(video.src);
        onFileSelect(file, video.duration);
      };

      video.onerror = () => {
        setSelectedFile(null);
        onError("Could not load video. Please try another file.");
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(file);
    },
    [onFileSelect, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept={getAcceptedFileTypes()}
          onChange={handleInputChange}
          className="hidden"
          id="video-upload"
        />
        <label
          htmlFor="video-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-gray-600 dark:text-gray-300">
            {selectedFile ? selectedFile.name : "Drop a video file or click to browse"}
          </span>
          {selectedFile && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatFileSize(selectedFile.size)}
            </span>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            MP4, WebM, or MOV (max 50MB, 5 minutes)
          </span>
        </label>
      </div>
    </div>
  );
}
