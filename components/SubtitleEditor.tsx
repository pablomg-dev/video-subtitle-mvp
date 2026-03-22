"use client";

import { Subtitle } from "../lib/types";
import { formatTimeShort } from "../lib/utils";

interface SubtitleEditorProps {
  subtitles: Subtitle[];
  onChange: (subtitles: Subtitle[]) => void;
  currentTime?: number;
}

export default function SubtitleEditor({
  subtitles,
  onChange,
  currentTime = 0,
}: SubtitleEditorProps) {
  const updateSubtitle = (id: number, text: string) => {
    onChange(
      subtitles.map((sub) =>
        sub.id === id ? { ...sub, text } : sub
      )
    );
  };

  const deleteSubtitle = (id: number) => {
    onChange(
      subtitles
        .filter((sub) => sub.id !== id)
        .map((sub, index) => ({ ...sub, id: index + 1 }))
    );
  };

  const getCurrentSubtitleId = (): number | null => {
    for (const sub of subtitles) {
      if (currentTime >= sub.start && currentTime <= sub.end) {
        return sub.id;
      }
    }
    return null;
  };

  const currentSubtitleId = getCurrentSubtitleId();

  if (subtitles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No subtitles yet. Upload a video and generate subtitles to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {subtitles.map((subtitle) => (
        <div
          key={subtitle.id}
          className={`flex gap-2 p-3 rounded-lg border transition-colors ${
            currentSubtitleId === subtitle.id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          }`}
        >
          <span className="text-gray-400 dark:text-gray-500 font-mono text-sm min-w-[2rem]">
            {subtitle.id}
          </span>
          <span className="text-gray-500 dark:text-gray-400 font-mono text-xs min-w-[4rem]">
            {formatTimeShort(subtitle.start)} - {formatTimeShort(subtitle.end)}
          </span>
          <input
            type="text"
            value={subtitle.text}
            onChange={(e) => updateSubtitle(subtitle.id, e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-200"
          />
          <button
            onClick={() => deleteSubtitle(subtitle.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete subtitle"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
