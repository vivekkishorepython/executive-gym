import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { cardSchema } from "@/lib/validation";
import { sameOrigin } from "@/lib/security";
import { z } from "zod";
import { readAll } from "@/lib/database";
import type { Card } from "@/lib/types";
export async function GET() {
  try {
    const db = await requireAdmin();
    const data = await readAll<Card>(db, "flashcards", "*");
    return NextResponse.json(
      data.sort((a, b) => a.display_order - b.display_order),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Unauthorized or unavailable" },
      { status: 401 },
    );
  }
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ message: "Invalid origin" }, { status: 403 });
  try {
    const db = await requireAdmin();
    const body = await request.json();
    const parsed = z
      .array(cardSchema)
      .min(1)
      .max(500)
      .safeParse(Array.isArray(body) ? body : [body]);
    if (!parsed.success)
      return NextResponse.json(
        { message: "Invalid card fields. Import at most 500 cards." },
        { status: 400 },
      );
    const { error } = await db.from("flashcards").upsert(parsed.data);
    if (error)
      return NextResponse.json(
        { message: "Could not save cards." },
        { status: 500 },
      );
    return NextResponse.json({ message: "Cards saved." });
  } catch {
    return NextResponse.json(
      { message: "Unauthorized or invalid request" },
      { status: 401 },
    );
  }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ message: "Invalid origin" }, { status: 403 });
  try {
    const db = await requireAdmin();
    const parsed = z
      .object({ id: z.string().uuid() })
      .safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    const { error } = await db
      .from("flashcards")
      .delete()
      .eq("id", parsed.data.id);
    if (error) throw error;
    return NextResponse.json({ message: "Card deleted." });
  } catch {
    return NextResponse.json(
      { message: "Unauthorized or unavailable" },
      { status: 401 },
    );
  }
}
