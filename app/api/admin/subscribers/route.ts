import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readAll } from "@/lib/database";
export async function GET() {
  try {
    const db = await requireAdmin();
    const data = await readAll(
      db,
      "subscribers",
      "email,name,status,consent_at,confirmed_at,unsubscribed_at",
    );
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Unauthorized or unavailable" },
      { status: 401 },
    );
  }
}
