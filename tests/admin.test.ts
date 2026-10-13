import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({ getUser: vi.fn(), from: vi.fn() }));
vi.mock("@/lib/supabase", () => ({
  configured: () => true,
  userClient: async () => ({
    auth: { getUser: mocks.getUser },
    from: mocks.from,
  }),
}));
import { requireAdmin, isAdministrator } from "@/lib/auth";
import { POST, DELETE, GET } from "@/app/api/admin/cards/route";
import { GET as subscribers } from "@/app/api/admin/subscribers/route";
beforeEach(() => {
  process.env.ADMIN_USER_ID = "admin";
  process.env.APP_URL = "http://localhost:3000";
  mocks.from.mockReset();
});
describe("admin authorization", () => {
  it("denies missing, different, or unconfigured admin identities", () => {
    expect(isAdministrator(undefined, "admin")).toBe(false);
    expect(isAdministrator("other", "admin")).toBe(false);
    expect(isAdministrator("admin", undefined)).toBe(false);
    expect(isAdministrator("admin", "admin")).toBe(true);
  });
  it("requires a verified designated user", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: "other" } },
      error: null,
    });
    await expect(requireAdmin()).rejects.toThrow("Unauthorized");
  });
  it("protects all admin endpoints before accessing data", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect((await GET()).status).toBe(401);
    expect((await subscribers()).status).toBe(401);
    const req = () =>
      new Request("http://localhost:3000/api/admin/cards", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "Content-Type": "application/json",
        },
        body: "{}",
      });
    expect((await POST(req())).status).toBe(401);
    expect((await DELETE(req())).status).toBe(401);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("denies cross-origin mutations", async () => {
    const r = await POST(
      new Request("http://localhost:3000/api/admin/cards", {
        method: "POST",
        headers: { origin: "https://evil.example" },
        body: "{}",
      }),
    );
    expect(r.status).toBe(403);
  });
});
