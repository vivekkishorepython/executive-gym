import Link from "next/link";
import {
  ArrowUpRight,
  Shield,
  Heart,
  Mic,
  Swords,
  Compass,
  Users,
  Handshake,
  Network,
  TrendingUp,
  KeyRound,
  Target,
  RotateCcw,
} from "lucide-react";
import Header from "@/components/Header";
import Subscribe from "@/components/Subscribe";
import { categories } from "@/lib/types";
import { publishedCards } from "@/lib/cards";
import { configured } from "@/lib/supabase";
export const dynamic = "force-dynamic";
const icons = [
  Shield,
  Heart,
  Mic,
  Swords,
  Compass,
  Users,
  Handshake,
  Network,
  TrendingUp,
  KeyRound,
  Target,
];
const descriptions = [
  "Speak clearly. Hold your ground.",
  "Understand first. Connect better.",
  "Be calm, clear, and credible.",
  "Turn tension into progress.",
  "Align expectations. Build trust.",
  "Lead with clarity and care.",
  "Collaborate with confidence.",
  "Work across boundaries.",
  "Make your contributions visible.",
  "Navigate authority thoughtfully.",
  "Move ideas into action.",
];
export default async function Home() {
  const cards = await publishedCards();
  return (
    <main className="shell">
      <Header />
      <section id="categories" aria-labelledby="workout-title">
        <div className="section-top flex-col items-start! gap-4 min-[900px]:flex-row min-[900px]:items-end!">
          <div>
            <span className="eyebrow">Choose your workout</span>
            <h1
              id="workout-title"
              style={{
                fontSize: "clamp(26px, 4vw, 36px)",
                lineHeight: 1.2,
                letterSpacing: "-0.9px",
                margin: "8px 0",
              }}
            >
              Build Your Executive Voice, One Situation at a Time
            </h1>
            <p>
              Choose a skill. Think through the situation. Reveal what to say.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/practice" className="primary">
              Practice all cards ↗
            </Link>
            <Link href="/practice?mode=weak" className="secondary">
              Practice my weak cards
            </Link>
          </div>
        </div>
        <div className="grid">
          {categories.map((category, index) => {
            const Icon = icons[index];
            return (
              <Link
                key={category}
                href={`/practice?category=${encodeURIComponent(category)}`}
                className={`category ${index === 0 ? "featured" : ""}`}
              >
                <div className="category-icon">
                  <Icon size={23} strokeWidth={1.4} />
                  <ArrowUpRight className="arrow" size={17} />
                </div>
                <h3>{category}</h3>
                <p>{descriptions[index]}</p>
                <span className="count">
                  {cards.filter((c) => c.category === category).length}{" "}
                  published cards
                </span>
              </Link>
            );
          })}
          <Link href="/practice?mode=weak" className="category practice-tile">
            <RotateCcw size={22} strokeWidth={1.4} />
            <h3>Your next rep.</h3>
            <p>
              Revisit the cards you want
              <br />
              to work on.
            </p>
            <span className="count">Practice my weak cards ↗</span>
          </Link>
        </div>
      </section>
      <section id="story" className="story">
        <div>
          <span className="eyebrow">Why Executive Gym exists</span>
          <h2>
            Technical excellence gets you in the room. Your executive voice
            helps you move forward.
          </h2>
        </div>
        <p>
          Founded by an IIT graduate who learned that succeeding in corporate
          America takes more than technical expertise, Executive Gym gives
          immigrants and ambitious professionals a place to practice high-stakes
          workplace conversations—one situation at a time.
        </p>
      </section>
      <Subscribe />
      <footer className="footer">
        <span>© {new Date().getFullYear()} Executive Gym</span>
        <span>Built for practice. Designed for progress.</span>
        <Link href="/admin">Admin</Link>
      </footer>
      {!configured() && (
        <p className="status">
          Local preview · 110 seed cards · Connect Supabase to enable shared
          content and subscriptions.
        </p>
      )}
    </main>
  );
}
