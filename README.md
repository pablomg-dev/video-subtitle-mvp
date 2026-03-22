# Video Subtitle MVP

A minimal web app for automatic video subtitling using Groq API.

## Features

- Upload video files (MP4, WebM, MOV)
- Generate subtitles using Whisper AI via Groq API
- Edit subtitle text
- Export subtitles as SRT file
- Client-side audio extraction with FFmpeg.wasm

## Requirements

- Node.js 18+
- Groq API key (free at https://console.groq.com)
- Modern browser (Chrome recommended)

## Setup

```bash
# Install dependencies
npm install

# Add your Groq API key to .env.local
# Edit .env.local and replace "your_key_here" with your actual key

# Run development server
npm run dev

# Open http://localhost:3000
```

## Usage

1. **Upload**: Drop a video file or click to browse
2. **Validate**: Files are checked for format, size (max 50MB), and duration (max 5 minutes)
3. **Generate**: Click "Generate Subtitles" to transcribe
4. **Edit**: Modify subtitle text directly in the editor
5. **Export**: Click "Download SRT" to save the subtitle file

### Mock Subtitles

Click "Use mock subtitles" to test without API key.

## Project Structure

```
├── app/
│   ├── api/transcribe/route.ts  # Groq API proxy
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Upload.tsx
│   ├── VideoPlayer.tsx
│   ├── SubtitleEditor.tsx
│   └── TranscribeButton.tsx
├── lib/
│   ├── types.ts
│   ├── utils.ts
│   ├── validators.ts
│   ├── transcriber.ts
│   └── srtExporter.ts
├── public/
│   └── favicon.svg
├── .env.local
└── README.md
```

## API

### POST /api/transcribe

Transcribes audio using Groq Whisper API.

**Request**: FormData with `audio` file (max 25MB WAV)

**Response**:
```json
{
  "subtitles": [
    { "id": 1, "start": 0.0, "end": 2.5, "text": "Hello world" }
  ]
}
```

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- FFmpeg.wasm (audio extraction)
- Groq API (transcription)

## License

MIT
