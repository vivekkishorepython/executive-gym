"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Card, Progress } from "@/lib/types";
import {
  moveIndex,
  remainingSeconds,
  shuffle,
  weakCards,
} from "@/lib/practice";
import Subscribe from "./Subscribe";
const storageKey = "executive-gym-progress-v1";
export default function Practice({
  cards,
  weak = false,
  title,
}: {
  cards: Card[];
  weak?: boolean;
  title: string;
}) {
  const [progress, setProgress] = useState<Progress>({});
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [deck, setDeck] = useState<Card[]>(cards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [deadline, setDeadline] = useState(Date.now() + 30000);
  const [visited, setVisited] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    let loaded: Progress = {};
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        loaded = Object.fromEntries(
          Object.entries(raw).filter(
            ([, value]) => value === "mastered" || value === "weak",
          ),
        ) as Progress;
      }
    } catch {
      setStorageError(true);
    }
    setProgress(loaded);
    setIndex(0);
    setVisited([]);
    setFinished(false);
    setRevealed(false);
    setSeconds(30);
    setDeadline(Date.now() + 30000);
    setDeck(weak ? weakCards(cards, loaded) : cards);
    setReady(true);
  }, [cards, weak]);
  const card = deck[index];
  useEffect(() => {
    setRevealed(false);
    setSeconds(30);
    setDeadline(Date.now() + 30000);
  }, [card?.id]);
  useEffect(() => {
    if (!ready || revealed || !card) return;
    const tick = () => setSeconds(remainingSeconds(deadline, Date.now()));
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [deadline, revealed, ready, card]);
  const reveal = useCallback(() => {
    if (!card) return;
    setRevealed(true);
    setVisited((old) => (old.includes(card.id) ? old : [...old, card.id]));
  }, [card]);
  const move = useCallback(
    (delta: number) => {
      setIndex((old) => moveIndex(old, delta, deck.length));
      setRevealed(false);
      setSeconds(30);
      setDeadline(Date.now() + 30000);
    },
    [deck.length],
  );
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof Element &&
        e.target.closest("input,textarea,select,button,a")
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1);
      }
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        reveal();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [move, reveal]);
  function mark(value: "mastered" | "weak") {
    const updated = { ...progress, [card.id]: value };
    setProgress(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      setStorageError(true);
    }
  }
  function again() {
    setIndex(0);
    setRevealed(false);
    setVisited([]);
    setFinished(false);
    setSeconds(30);
    setDeadline(Date.now() + 30000);
  }
  if (!ready)
    return (
      <p className="empty" role="status">
        Loading your practice…
      </p>
    );
  if (!card)
    return (
      <section className="empty">
        <h2>
          {weak ? "Your weak-card list is clear." : "No published cards yet."}
        </h2>
        <p>
          {weak
            ? "Mark any card “Need Practice” to build your own workout."
            : "Check back for a new workout soon."}
        </p>
        <Link className="primary" href="/practice">
          Explore all cards
        </Link>
      </section>
    );
  return (
    <>
      <section className="practice-wrap" aria-label={title}>
        <div className="practice-header">
          <Link className="quiet-link" href="/#categories">
            ← Back to the gym
          </Link>
          <span className="timer" aria-label="Card number">
            {index + 1} / {deck.length}
          </span>
        </div>
        <div className="progress-bar">
          <div style={{ width: `${(visited.length / deck.length) * 100}%` }} />
        </div>
        {finished ? (
          <section className="empty">
            <span className="eyebrow">A rep worth taking</span>
            <h2>Practice complete.</h2>
            <p>
              You revealed {visited.length} of {deck.length} cards this session.
            </p>
            <button className="primary" onClick={again}>
              Practice Again
            </button>
          </section>
        ) : (
          <>
            <article
              className={`flashcard mt-4! ${revealed ? "flipped" : ""}`}
              key={`${card.id}-${revealed}`}
              aria-label={
                revealed ? "Recommended response" : "Workplace situation"
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  alignItems: "start",
                  width: "100%",
                }}
              >
                <span className="eyebrow">
                  {revealed ? "Response" : "Situation"} · {card.category}
                </span>
                <span className="timer shrink-0" aria-label="Time to think">
                  {revealed
                    ? card.difficulty
                    : seconds > 0
                      ? `${seconds}s to think`
                      : "Take your time"}
                </span>
              </div>
              <h2>{revealed ? `“${card.back}”` : card.front}</h2>
              {revealed ? (
                <p>{card.explanation}</p>
              ) : (
                <button className="primary" onClick={reveal}>
                  Reveal response ↗
                </button>
              )}
              {!revealed && seconds === 0 && (
                <p role="status">Time’s up. Reveal whenever you’re ready.</p>
              )}
              {revealed && (
                <div className="controls" style={{ justifyContent: "start" }}>
                  <button
                    aria-pressed={progress[card.id] === "mastered"}
                    className={
                      progress[card.id] === "mastered" ? "primary" : "secondary"
                    }
                    onClick={() => mark("mastered")}
                  >
                    ✓ Mastered
                  </button>
                  <button
                    aria-pressed={progress[card.id] === "weak"}
                    className={
                      progress[card.id] === "weak" ? "primary" : "secondary"
                    }
                    onClick={() => mark("weak")}
                  >
                    ↻ Need Practice
                  </button>
                </div>
              )}
            </article>
            <div className="controls">
              <button className="secondary" onClick={() => move(-1)}>
                ← Previous
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setDeck(shuffle(deck));
                  setIndex(0);
                  setRevealed(false);
                  setDeadline(Date.now() + 30000);
                }}
              >
                Shuffle
              </button>
              <button className="primary" onClick={() => move(1)}>
                Next →
              </button>
            </div>
            <div className="controls">
              <button className="quiet-link" onClick={again}>
                Practice Again
              </button>
              <button className="quiet-link" onClick={() => setFinished(true)}>
                Finish session
              </button>
              <Link className="quiet-link" href="/practice?mode=weak">
                Practice My Weak Cards
              </Link>
            </div>
            <p className="status" style={{ textAlign: "center" }}>
              ← → to navigate · Space to reveal · Progress stays on this browser
            </p>
          </>
        )}
        {storageError && (
          <p role="status" className="error">
            Browser storage is unavailable. Your progress will last only for
            this session.
          </p>
        )}
      </section>
      {finished && <Subscribe />}
    </>
  );
}
