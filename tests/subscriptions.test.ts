import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/lib/supabase", () => ({ service: () => ({ rpc: mocks.rpc }) }));
import {
  subscribe,
  consumeToken,
  hashToken,
  validToken,
} from "@/lib/subscriptions";
const body = {
  email: "TEST@example.com",
  name: "Test",
  consent: true,
  website: "",
};
beforeEach(() => {
  Object.assign(process.env, {
    RESEND_API_KEY: "test",
    EMAIL_FROM: "test@example.com",
    APP_URL: "https://gym.example",
    RATE_LIMIT_SALT: "test-salt",
    SUPABASE_SERVICE_ROLE_KEY: "test",
    NEXT_PUBLIC_SUPABASE_URL: "https://db.example",
  });
  mocks.rpc.mockReset();
});
describe("subscriptions", () => {
  it("requires valid email and explicit consent; rejects the honeypot", async () => {
    expect((await subscribe({ ...body, consent: false }, "ip")).status).toBe(
      400,
    );
    expect((await subscribe({ ...body, email: "bad" }, "ip")).status).toBe(400);
    expect((await subscribe({ ...body, website: "spam" }, "ip")).status).toBe(
      400,
    );
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("rate limits before writing subscriber records", async () => {
    mocks.rpc.mockResolvedValue({ data: false, error: null });
    expect((await subscribe(body, "ip")).status).toBe(429);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
  });
  it("handles confirmed duplicates without sending or disclosing status", async () => {
    mocks.rpc
      .mockResolvedValueOnce({ data: true })
      .mockResolvedValueOnce({ data: true })
      .mockResolvedValueOnce({ data: false });
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const result = await subscribe(body, "ip");
    expect(result.status).toBe(200);
    expect(result.message).toContain("only after confirming");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("normalizes emails, stores hashes, and sends working confirmation and unsubscribe links", async () => {
    mocks.rpc.mockResolvedValue({ data: true, error: null });
    const email = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
    const result = await subscribe(body, "ip");
    expect(result.status).toBe(200);
    const parameters = mocks.rpc.mock.calls[2][1];
    expect(parameters.p_email).toBe("test@example.com");
    const sent = JSON.parse(email.mock.calls[0][1]!.body as string);
    const token = sent.text.match(/confirm\?token=([a-f0-9]{64})/)[1];
    expect(parameters.p_confirm_hash).toBe(hashToken(token));
    expect(sent.text).toContain("/unsubscribe?token=");
    expect(sent.text).toContain("not subscribed until");
  });
  it("reports email delivery failures without claiming a subscription", async () => {
    mocks.rpc.mockResolvedValue({ data: true, error: null });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("{}", { status: 500 }),
    );
    await expect(subscribe(body, "ip")).rejects.toThrow(
      "Email provider unavailable",
    );
  });
  it("validates tokens and distinguishes expired confirmation from success", async () => {
    expect(validToken("bad")).toBe(false);
    expect(await consumeToken("confirm", "bad")).toBe(false);
    mocks.rpc.mockResolvedValue({ data: false });
    expect(await consumeToken("confirm", "a".repeat(64))).toBe(false);
    mocks.rpc.mockResolvedValue({ data: true });
    expect(await consumeToken("confirm", "a".repeat(64))).toBe(true);
    expect(await consumeToken("unsubscribe", "b".repeat(64))).toBe(true);
    expect(mocks.rpc).toHaveBeenLastCalledWith("unsubscribe_subscription", {
      p_hash: hashToken("b".repeat(64)),
    });
  });
});
