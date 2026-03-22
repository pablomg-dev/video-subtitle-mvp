import { NextRequest, NextResponse } from "next/server";
import { Subtitle } from "@/lib/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

interface GroqSegment {
  start: number;
  end: number;
  text: string;
}

interface GroqResponse {
  text?: string;
  segments?: GroqSegment[];
  error?: {
    message: string;
    type: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 25MB." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const transcriptionFormData = new FormData();
    transcriptionFormData.append("file", audioFile);
    transcriptionFormData.append("model", "whisper-large-v3-turbo");
    transcriptionFormData.append("response_format", "verbose_json");
    transcriptionFormData.append("timestamp_granularities[]", "segment");

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
      body: transcriptionFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API error:", response.status, errorData);
      return NextResponse.json(
        { error: `Groq API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data: GroqResponse = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message },
        { status: 500 }
      );
    }

    const subtitles: Subtitle[] = [];

    if (data.segments && data.segments.length > 0) {
      data.segments.forEach((segment, index) => {
        subtitles.push({
          id: index + 1,
          start: segment.start,
          end: segment.end,
          text: segment.text.trim(),
        });
      });
    } else if (data.text) {
      subtitles.push({
        id: 1,
        start: 0,
        end: 30,
        text: data.text.trim(),
      });
    }

    return NextResponse.json({ subtitles });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
