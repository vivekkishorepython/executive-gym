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
      <section className="hero">
        <div>
          <span className="eyebrow">
            <span className="dot" />
            Your daily workout for the workplace
          </span>
          <h1>
            Stop being overlooked.
            <br />
            <em>Start being heard.</em>
          </h1>
          <p className="intro">
            Build the executive reflexes to speak confidently, handle difficult
            conversations, and influence decisions.
          </p>
          <div className="hero-meta">
            <span>↗ 11 essential skills</span>
            <span>◷ 30 seconds at a time</span>
            <span>◎ No account needed</span>
          </div>
        </div>
        <div className="sample">
          <div className="sample-label">
            <span>IF → THEN</span>
            <span>01 / ASSERTIVENESS</span>
          </div>
          <h3>Someone criticizes my work.</h3>
          <hr />
          <div className="response">
            “Can you give me a<br />
            specific example?”
          </div>
          <p>
            Move from vague criticism to specific,
            <br />
            actionable feedback.
          </p>
        </div>
      </section>
      <section id="categories">
        <div className="section-top">
          <div>
            <span className="eyebrow">Choose your workout</span>
            <h2>Small reps. Stronger leadership.</h2>
            <p>Pick a skill. Meet a real situation. Practice your response.</p>
          </div>
          <Link href="/practice" className="quiet-link">
            Practice all cards ↗
          </Link>
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
            Excellence needs
            <br />a voice.
          </h2>
        </div>
        <p>
          Executive Gym grew from the experience of an IIT graduate with a
          master’s degree, working in corporate America on an H-1B visa. The
          lesson was simple: technical excellence alone wasn’t enough to
          advance. Speaking up, navigating difficult conversations, and
          influencing decisions required practice, too.
          <br />
          <br />
          This is a space for Indian immigrants and other professionals to build
          those habits—one realistic workplace moment at a time.
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
