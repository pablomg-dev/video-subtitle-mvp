# Video Subtitle MVP

Automatic video subtitler powered by Groq Whisper AI.

![Next.js 14+](https://img.shields.io/badge/Next.js-14%2B-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript 5+](https://img.shields.io/badge/TypeScript-5%2B-3178C6?style=flat&logo=typescript&logoColor=white)
![React 18+](https://img.shields.io/badge/React-18%2B-61DAFB?style=flat&logo=react&logoColor=white)
![Tailwind CSS 3+](https://img.shields.io/badge/Tailwind_CSS-3%2B-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![FFmpeg.wasm 0.12+](https://img.shields.io/badge/FFmpeg.wasm-0.12%2B-007808?style=flat&logo=ffmpeg&logoColor=white)
![Groq Whisper large-v3](https://img.shields.io/badge/Groq-Whisper_large--v3-ED4C33?style=flat)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=flat&logo=vercel&logoColor=white)
[![Live demo](https://img.shields.io/badge/Live_demo-Online-16a34a?style=flat)](https://video-subtitle-mvp.vercel.app)

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