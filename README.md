# Video Subtitle MVP

A minimal web app for automatic video subtitling with client-side Whisper integration.

## Features

- Upload video files (MP4, WebM, MOV)
- Generate subtitles using mock transcription (Whisper-ready architecture)
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
3. **Generate**: Click "Generate Subtitles" to create mock subtitles
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
│   ├── mockTranscriber.ts # Mock + Whisper placeholder
│   ├── srtExporter.ts    # SRT generation
│   └── transcriber.ts    # Integration point
├── public/
│   └── favicon.svg       # App favicon
├── package.json
└── README.md
```

## Adding Real Whisper Transcription

The app uses a mock transcriber by default. To integrate real Whisper:

1. Install transformers.js:
   ```bash
   npm install @huggingface/transformers
   ```

2. Implement `WhisperTranscriber` in `lib/mockTranscriber.ts`

3. Update `lib/transcriber.ts` to use the real transcriber:
   ```typescript
   let transcriber: Transcriber = new WhisperTranscriber();
   ```

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
