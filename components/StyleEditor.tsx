"use client";

import { SubtitleStyle } from "../lib/types";

interface StyleEditorProps {
  style: SubtitleStyle;
  onChange: (s: SubtitleStyle) => void;
  videoAspectRatio?: "landscape" | "portrait" | "square";
}

const FONTS = [
  "Arial",
  "Impact",
  "Georgia",
  "Verdana",
  "Trebuchet MS",
  "Courier New",
];

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

function getPreviewContainerStyle(aspectRatio: "landscape" | "portrait" | "square"): React.CSSProperties {
  if (aspectRatio === "portrait") {
    return { width: "120px", height: "213px", margin: "0 auto", position: "relative" as const };
  } else if (aspectRatio === "square") {
    return { width: "120px", height: "120px", margin: "0 auto", position: "relative" as const };
  }
  return { width: "100%", height: "80px", position: "relative" as const };
}

export default function StyleEditor({ style, onChange, videoAspectRatio = "landscape" }: StyleEditorProps) {
  const update = (partial: Partial<SubtitleStyle>) => {
    onChange({ ...style, ...partial });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Fuente
          </label>
          <select
            value={style.fontFamily}
            onChange={(e) => update({ fontFamily: e.target.value })}
            className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Tamaño: {style.fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="72"
            value={style.fontSize}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Color texto
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.color}
              onChange={(e) => update({ color: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {style.color}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Color fondo
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={style.bgColor}
              onChange={(e) => update({ bgColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {style.bgColor}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Opacidad: {Math.round(style.bgOpacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={style.bgOpacity}
            onChange={(e) => update({ bgOpacity: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Negrita
          </label>
          <button
            onClick={() => update({ bold: !style.bold })}
            className={`px-3 py-1 text-sm rounded border transition-colors ${
              style.bold
                ? "bg-gray-800 text-white border-gray-800 dark:bg-white dark:text-gray-800"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            }`}
          >
            <strong>B</strong>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
          Posición
        </label>
        <div className="flex gap-1">
          <button
            onClick={() => update({ position: "top" })}
            className={`flex-1 px-2 py-1 text-xs rounded border transition-colors ${
              style.position === "top"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            }`}
          >
            Arriba
          </button>
          <button
            onClick={() => update({ position: "middle" })}
            className={`flex-1 px-2 py-1 text-xs rounded border transition-colors ${
              style.position === "middle"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            }`}
          >
            Centro
          </button>
          <button
            onClick={() => update({ position: "bottom" })}
            className={`flex-1 px-2 py-1 text-xs rounded border transition-colors ${
              style.position === "bottom"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            }`}
          >
            Abajo
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
          Vista previa
        </label>
        <div
          className="rounded-lg overflow-hidden"
          style={{
            ...getPreviewContainerStyle(videoAspectRatio),
            backgroundColor: "#1a1a1a",
            display: "flex",
            alignItems: style.position === "top"
              ? "flex-start"
              : style.position === "middle"
              ? "center"
              : "flex-end",
            padding: "8px",
          }}
        >
          <span
            style={{
              fontFamily: style.fontFamily,
              fontSize: "14px",
              fontWeight: style.bold ? "bold" : "normal",
              color: style.color,
              backgroundColor: hexToRgba(style.bgColor, style.bgOpacity),
              padding: "0.3em 0.6em",
              borderRadius: "4px",
              textAlign: "center",
              maxWidth: "90%",
              lineHeight: 1.35,
            }}
          >
            Así se ven tus subtítulos
          </span>
        </div>
      </div>
    </div>
  );
}
