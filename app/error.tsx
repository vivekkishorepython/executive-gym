"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="shell empty">
      <h2>We couldn’t load this page.</h2>
      <p>Please try again in a moment.</p>
      <button className="primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
