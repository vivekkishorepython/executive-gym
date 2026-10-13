"use client";
import { useState } from "react";
export default function Subscribe() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <section className="newsletter" id="subscribe">
      <div>
        <span className="eyebrow">
          A little practice. A lasting difference.
        </span>
        <h2>Keep building your voice.</h2>
        <p>Get new practice cards and occasional updates from Executive Gym.</p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setStatus("");
          const form = e.currentTarget;
          const data = new FormData(form);
          try {
            const response = await fetch("/api/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: data.get("email"),
                name: data.get("name") || "",
                consent: data.get("consent") === "on",
                website: data.get("website") || "",
              }),
            });
            const body = await response.json();
            setStatus(body.message);
            if (response.ok) form.reset();
          } catch {
            setStatus("Could not send your request. Please try again.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="fields">
          <label className="sr-only" htmlFor="subscriber-name">
            Name (optional)
          </label>
          <input
            id="subscriber-name"
            name="name"
            placeholder="Name (optional)"
            maxLength={100}
            autoComplete="given-name"
          />
          <label className="sr-only" htmlFor="subscriber-email">
            Email address
          </label>
          <input
            id="subscriber-email"
            name="email"
            type="email"
            placeholder="Your email address"
            required
            maxLength={254}
            autoComplete="email"
          />
          <button className="primary" disabled={busy}>
            {busy ? "Sending…" : "Keep me posted ↗"}
          </button>
        </div>
        <div className="hidden-trap" aria-hidden="true">
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-label="Leave blank"
          />
        </div>
        <label className="consent">
          <input type="checkbox" name="consent" required />I agree to receive
          emails from Executive Gym. I can unsubscribe at any time.
        </label>
        <p role="status" className="status">
          {status ||
            "We’ll send a confirmation link. Your subscription starts after you confirm."}
        </p>
      </form>
    </section>
  );
}
