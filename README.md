# Video Subtitle MVP

A minimal web app for automatic video subtitling.

## Features

- Upload video files (MP4, WebM, MOV)
- Generate subtitles using mock transcription
- Edit subtitle text
- Export subtitles as SRT file
- Client-side only (no backend required)
- Device performance warning for slow machines

## Requirements

- Node.js 18+ 
- Modern browser (Chrome, Firefox, Safari, Edge)

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Usage

1. **Upload**: Drop a video file or click to browse
2. **Validate**: Files are checked for format, size (max 50MB), and duration (max 5 minutes)
3. **Generate**: Click "Generate Subtitles" to create subtitles
4. **Edit**: Modify subtitle text directly in the editor
5. **Export**: Click "Download SRT" to save the subtitle file

## Project Structure

```
├── app/
│   ├── globals.css       # Tailwind imports
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── Upload.tsx        # Drag-drop file upload
│   ├── VideoPlayer.tsx   # HTML5 video player
│   └── SubtitleEditor.tsx # Editable subtitle list
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── utils.ts          # Time formatting
│   ├── validators.ts     # File validation
│   ├── mockTranscriber.ts # Mock transcription
│   └── srtExporter.ts    # SRT generation
├── public/
│   └── favicon.svg       # App favicon
├── package.json
└── README.md
```

## Whisper Integration

The app currently uses mock transcription. To integrate real Whisper:

### Option 1: Vite SPA (Recommended)

Create a separate Vite-based React app for the transcription:

```bash
npm create vite@latest whisper-app -- --template react-ts
cd whisper-app
npm install @huggingface/transformers
# Implement using lib/whisperTranscriber.full.ts as reference
```

### Option 2: Static Export + CDN

1. Build as static export:
   ```bash
   npm run build
   # Serve the out/ directory
   ```

2. Load transformers.js from CDN in your HTML

### Option 3: Standalone Node.js Script

Use the transcription logic in a Node.js script with proper WASM support.

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS

## License

MIT
