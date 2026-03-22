# Video Subtitle MVP

Automatic video subtitler powered by Groq Whisper AI.

## Features
- Upload video (MP4, WebM, MOV — max 50MB, 5 min)
- Automatic transcription using Groq Whisper API
- Real-time subtitle preview on video
- Edit subtitle text and timestamps individually
- Visual timeline showing all subtitles
- Export subtitles as SRT file

## Tech stack
- Next.js 14 + TypeScript + Tailwind CSS
- Groq API (Whisper large-v3) for transcription
- FFmpeg.wasm for audio extraction
- Deployed on Vercel

## Setup
1. Clone the repo
2. npm install
3. Create .env.local with: GROQ_API_KEY=your_key_here
4. Get free API key at console.groq.com
5. npm run dev

## Limits (free tier)
- Groq: 7,200 seconds of audio/day
- Max video: 50MB, 5 minutes