import { NextResponse } from "next/server";
import { subscribe } from "@/lib/subscriptions";
import { sameOrigin } from "@/lib/security";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 },
    );
  if (Number(request.headers.get("content-length") || 0) > 4096)
    return NextResponse.json(
      { message: "Request too large." },
      { status: 413 },
    );
  try {
    const text = await request.text();
    if (text.length > 4096)
      return NextResponse.json(
        { message: "Request too large." },
        { status: 413 },
      );
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { message: "Invalid request." },
        { status: 400 },
      );
    }
    const ip = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local";
    const result = await subscribe(body, ip);
    return NextResponse.json(
      { message: result.message },
      { status: result.status, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      {
        message:
          "We couldn’t send a confirmation. Please try again in a few minutes.",
      },
      { status: 503 },
    );
  }
}
