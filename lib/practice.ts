import type { Card, Progress } from "./types";
export function moveIndex(index: number, delta: number, length: number) {
  return length ? (index + delta + length) % length : 0;
}
export function remainingSeconds(deadline: number, now: number) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
export function weakCards(cards: Card[], progress: Progress) {
  return cards.filter((c) => progress[c.id] === "weak");
}
export function shuffle<T>(items: T[], random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
