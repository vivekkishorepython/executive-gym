import { NextResponse } from "next/server";
import { consumeToken } from "./subscriptions";
import { sameOrigin } from "./security";
export async function tokenAction(
  request: Request,
  kind: "confirm" | "unsubscribe",
) {
  if (!sameOrigin(request))
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 256)
      return NextResponse.json({ message: "Invalid link." }, { status: 400 });
    const { token } = JSON.parse(text);
    if (typeof token !== "string")
      return NextResponse.json({ message: "Invalid link." }, { status: 400 });
    const success = await consumeToken(kind, token);
    return NextResponse.json(
      {
        message: success
          ? kind === "confirm"
            ? "Your subscription is confirmed. Welcome to Executive Gym."
            : "You have been unsubscribed."
          : "This link is invalid, expired, or already used. For confirmation, request a fresh link from the homepage.",
      },
      { status: success ? 200 : 400, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "This request is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
