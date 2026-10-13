import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Practice from "@/components/Practice";
import { seedCards } from "@/lib/content";
import { categories } from "@/lib/types";
const cards = seedCards.slice(0, 3);
describe("practice", () => {
  it("wraps previous/next and supports keyboard reveal", () => {
    render(<Practice cards={cards} title="Practice" />);
    expect(screen.getByText(cards[0].front)).toBeTruthy();
    fireEvent.click(screen.getByText("← Previous"));
    expect(screen.getByText(cards[2].front)).toBeTruthy();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText(cards[0].front)).toBeTruthy();
    fireEvent.keyDown(window, { code: "Space" });
    expect(screen.getByText(`“${cards[0].back}”`)).toBeTruthy();
  });
  it("never reveals automatically and resets the timer on navigation", () => {
    vi.useFakeTimers();
    render(<Practice cards={cards} title="Practice" />);
    act(() => vi.advanceTimersByTime(30000));
    expect(screen.getByText("Take your time")).toBeTruthy();
    expect(screen.queryByText(`“${cards[0].back}”`)).toBeNull();
    fireEvent.click(screen.getByText("Next →"));
    expect(screen.getByText("30s to think")).toBeTruthy();
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("25s to think")).toBeTruthy();
    fireEvent.click(screen.getByText("Reveal response ↗"));
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByText(`“${cards[1].back}”`)).toBeTruthy();
    vi.useRealTimers();
  });
  it("saves weak cards and loads only those cards in weak mode", () => {
    const { unmount } = render(<Practice cards={cards} title="Practice" />);
    fireEvent.click(screen.getByText("Reveal response ↗"));
    fireEvent.click(screen.getByText("↻ Need Practice"));
    expect(
      JSON.parse(localStorage.getItem("executive-gym-progress-v1")!)[
        cards[0].id
      ],
    ).toBe("weak");
    unmount();
    render(<Practice cards={cards} weak title="Weak" />);
    expect(screen.getByText("1 / 1")).toBeTruthy();
    expect(screen.getByText(cards[0].front)).toBeTruthy();
  });
  it("resets the revealed card when switching to weak mode", () => {
    const { rerender } = render(<Practice cards={cards} title="Practice" />);
    fireEvent.click(screen.getByText("Reveal response ↗"));
    fireEvent.click(screen.getByText("↻ Need Practice"));
    rerender(<Practice cards={cards} weak title="Weak" />);
    expect(screen.getByText("Reveal response ↗")).toBeTruthy();
    expect(screen.getByText("30s to think")).toBeTruthy();
  });
  it("contains exactly 10 distinct published cards in each category", () => {
    expect(seedCards).toHaveLength(110);
    expect(new Set(seedCards.map((c) => c.id)).size).toBe(110);
    categories.forEach((category) =>
      expect(
        seedCards.filter((c) => c.category === category && c.published),
      ).toHaveLength(10),
    );
  });
});
