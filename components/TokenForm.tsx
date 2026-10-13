"use client";
import { useState } from "react";
import Link from "next/link";
export default function TokenForm({
  kind,
  token,
}: {
  kind: "confirm" | "unsubscribe";
  token: string;
}) {
  const [status, setStatus] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <section className="practice-wrap empty">
      <span className="eyebrow">Executive Gym emails</span>
      <h2>
        {kind === "confirm"
          ? "Confirm your subscription."
          : "Unsubscribe from emails."}
      </h2>
      <p>
        {kind === "confirm"
          ? "Choose confirm to start receiving Executive Gym emails."
          : "Choose unsubscribe to stop receiving Executive Gym emails."}
      </p>
      {!done && (
        <button
          className="primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const r = await fetch(`/api/${kind}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
              });
              setStatus((await r.json()).message);
              setDone(r.ok);
            } catch {
              setStatus("Request failed. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy
            ? "Processing…"
            : kind === "confirm"
              ? "Confirm subscription"
              : "Unsubscribe"}
        </button>
      )}
      <p role="status">{status}</p>
      <Link className="quiet-link" href="/">
        Back to the gym
      </Link>
    </section>
  );
}
