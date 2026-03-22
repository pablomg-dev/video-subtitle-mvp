"use client";

import { useState } from "react";
import { Subtitle } from "../lib/types";
import { formatTimeShort } from "../lib/utils";

interface SubtitleEditorProps {
  subtitles: Subtitle[];
  onChange: (subtitles: Subtitle[]) => void;
  currentTime?: number;
  highlightedId?: number | null;
}

interface EditingTime {
  id: number;
  field: "start" | "end";
  value: string;
}

export default function SubtitleEditor({
  subtitles,
  onChange,
  currentTime = 0,
  highlightedId,
}: SubtitleEditorProps) {
  const [editingTime, setEditingTime] = useState<EditingTime | null>(null);

  const updateSubtitle = (id: number, text: string) => {
    onChange(
      subtitles.map((sub) =>
        sub.id === id ? { ...sub, text } : sub
      )
    );
  };

  const updateSubtitleTimes = (id: number, startTime: number, endTime: number) => {
    onChange(
      subtitles.map((sub) =>
        sub.id === id ? { ...sub, start: startTime, end: endTime } : sub
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

  const startEditingTime = (id: number, field: "start" | "end", currentValue: number) => {
    setEditingTime({ id, field, value: Math.round(currentValue).toString() });
  };

  const cancelEditingTime = () => {
    setEditingTime(null);
  };

  const saveEditingTime = () => {
    if (!editingTime) return;

    const { id, field, value } = editingTime;
    const newTime = Math.round(parseFloat(value));

    if (isNaN(newTime) || newTime < 0) {
      setEditingTime(null);
      return;
    }

    const subtitle = subtitles.find((s) => s.id === id);
    if (!subtitle) {
      setEditingTime(null);
      return;
    }

    if (field === "start") {
      if (newTime >= subtitle.end) {
        setEditingTime(null);
        return;
      }
      updateSubtitleTimes(id, newTime, subtitle.end);
    } else {
      if (newTime <= subtitle.start) {
        setEditingTime(null);
        return;
      }
      updateSubtitleTimes(id, subtitle.start, newTime);
    }

    setEditingTime(null);
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEditingTime();
    } else if (e.key === "Escape") {
      cancelEditingTime();
    }
  };

  const handleTimeChange = (value: string) => {
    if (!editingTime) return;
    setEditingTime({ ...editingTime, value });
  };

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
          className={`flex gap-2 p-3 rounded-lg border transition-colors items-center ${
            highlightedId === subtitle.id
              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 ring-2 ring-purple-400"
              : currentSubtitleId === subtitle.id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          }`}
        >
          <span className="text-gray-400 dark:text-gray-500 font-mono text-sm min-w-[2rem]">
            {subtitle.id}
          </span>

          {editingTime?.id === subtitle.id && editingTime?.field === "start" ? (
            <input
              type="number"
              step="1"
              min="0"
              value={editingTime.value}
              onChange={(e) => handleTimeChange(e.target.value)}
              onBlur={saveEditingTime}
              onKeyDown={handleTimeKeyDown}
              autoFocus
              id={`subtitle-start-${subtitle.id}`}
              name={`subtitle-start-${subtitle.id}`}
              className="w-16 px-1 py-0.5 bg-white dark:bg-gray-700 border border-blue-500 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
            />
          ) : (
            <button
              onClick={() => startEditingTime(subtitle.id, "start", subtitle.start)}
              className="text-gray-500 dark:text-gray-400 font-mono text-xs min-w-[3rem] hover:text-blue-500 cursor-pointer"
            >
              {formatTimeShort(subtitle.start)}
            </button>
          )}

          <span className="text-gray-400">-</span>

          {editingTime?.id === subtitle.id && editingTime?.field === "end" ? (
            <input
              type="number"
              step="1"
              min="0"
              value={editingTime.value}
              onChange={(e) => handleTimeChange(e.target.value)}
              onBlur={saveEditingTime}
              onKeyDown={handleTimeKeyDown}
              autoFocus
              id={`subtitle-end-${subtitle.id}`}
              name={`subtitle-end-${subtitle.id}`}
              className="w-16 px-1 py-0.5 bg-white dark:bg-gray-700 border border-blue-500 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
            />
          ) : (
            <button
              onClick={() => startEditingTime(subtitle.id, "end", subtitle.end)}
              className="text-gray-500 dark:text-gray-400 font-mono text-xs min-w-[3rem] hover:text-blue-500 cursor-pointer"
            >
              {formatTimeShort(subtitle.end)}
            </button>
          )}

          <textarea
            id={`subtitle-text-${subtitle.id}`}
            name={`subtitle-text-${subtitle.id}`}
            value={subtitle.text}
            rows={1}
            onChange={(e) => {
              updateSubtitle(subtitle.id, e.target.value);
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
            }}
            onInput={(e) => {
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
            }}
            className="flex-1 min-w-0 w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 resize-none"
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
