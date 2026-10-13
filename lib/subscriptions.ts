import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { service } from "./supabase";
import { subscriptionSchema } from "./validation";
export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export const validToken = (token: string) => /^[a-f0-9]{64}$/.test(token);
export const genericMessage =
  "If this address needs confirmation, check your inbox for a link. You are subscribed only after confirming.";
export function subscriptionsConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
    process.env.EMAIL_FROM &&
    process.env.APP_URL &&
    process.env.RATE_LIMIT_SALT &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}
export async function subscribe(body: unknown, ip: string) {
  const parsed = subscriptionSchema.safeParse(body);
  if (!parsed.success)
    return {
      status: 400,
      message: "Enter a valid email and explicitly agree to receive emails.",
    };
  if (!subscriptionsConfigured())
    return {
      status: 503,
      message: "Email signups are not available yet. Please try again later.",
    };
  const db = service();
  const { email, name } = parsed.data;
  for (const [identifier, limit] of [
    [`ip:${ip}`, 5],
    [`email:${email}`, 3],
  ] as const) {
    const key = hashToken(`${process.env.RATE_LIMIT_SALT}:${identifier}`);
    const { data, error } = await db.rpc("take_subscription_limit", {
      p_key: key,
      p_limit: limit,
      p_seconds: 3600,
    });
    if (error) throw new Error("Rate limit unavailable");
    if (!data)
      return {
        status: 429,
        message: "Too many requests. Please try again in an hour.",
      };
  }
  const confirmToken = randomBytes(32).toString("hex");
  const unsubscribeToken = randomBytes(32).toString("hex");
  const { data: shouldSend, error } = await db.rpc("request_subscription", {
    p_email: email,
    p_name: name,
    p_confirm_hash: hashToken(confirmToken),
    p_unsubscribe_hash: hashToken(unsubscribeToken),
  });
  if (error) throw new Error("Subscription unavailable");
  if (!shouldSend) return { status: 200, message: genericMessage };
  const base = new URL(process.env.APP_URL!).origin;
  const confirm = `${base}/confirm?token=${confirmToken}`;
  const unsubscribe = `${base}/unsubscribe?token=${unsubscribeToken}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": hashToken(confirmToken),
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [email],
      subject: "Confirm your Executive Gym subscription",
      text: `Confirm that you want to receive Executive Gym emails:\n\n${confirm}\n\nThis link expires in 24 hours. You are not subscribed until you confirm.\n\nIf you did not request this, ignore this email or unsubscribe here:\n${unsubscribe}`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Email provider unavailable");
  return { status: 200, message: genericMessage };
}
export async function consumeToken(
  kind: "confirm" | "unsubscribe",
  token: string,
) {
  if (!validToken(token) || !subscriptionsConfigured()) return false;
  const { data, error } = await service().rpc(
    kind === "confirm" ? "confirm_subscription" : "unsubscribe_subscription",
    { p_hash: hashToken(token) },
  );
  if (error) throw new Error("Request unavailable");
  return Boolean(data);
}
