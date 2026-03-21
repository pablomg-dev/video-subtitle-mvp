# Video Subtitle MVP

A minimal web app for automatic video subtitling with client-side Whisper integration.

## Features

- Upload video files (MP4, WebM, MOV)
- Generate subtitles using real Whisper AI (tiny model)
- Edit subtitle text
- Export subtitles as SRT file
- Client-side only (no backend required)
- Device performance warning for slow machines

## Requirements

- Node.js 18+ 
- Modern browser (Chrome, Firefox, Safari, Edge)
- 4GB+ RAM recommended for Whisper transcription

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
3. **Generate**: Click "Generate Subtitles" to create subtitles with Whisper AI
4. **Edit**: Modify subtitle text directly in the editor
5. **Export**: Click "Download SRT" to save the subtitle file

### Mock Mode

Enable "Use mock mode" checkbox to use fake subtitles for testing without AI.

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
│   ├── whisperClient.ts  # Real Whisper transcription (client-only)
│   └── srtExporter.ts    # SRT generation
├── public/
│   └── favicon.svg       # App favicon
├── package.json
└── README.md
```

## Technical Details

### Whisper Integration

- Uses `@huggingface/transformers` for client-side inference
- Model: `Xenova/whisper-tiny` (smallest, fastest)
- Runs entirely in the browser using WebAssembly
- Audio extracted from video and resampled to 16kHz mono

### SSR Compatibility

The Whisper code uses dynamic imports to avoid Next.js SSR bundling issues:
- Whisper code is in `lib/whisperClient.ts`
- Imported dynamically only when user clicks "Generate Subtitles"
- `webpack.IgnorePlugin` excludes problematic WASM modules from SSR

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
- @huggingface/transformers

## License

MIT
