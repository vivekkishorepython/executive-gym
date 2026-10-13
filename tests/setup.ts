import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
vi.mock("server-only", () => ({}));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});
