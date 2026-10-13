"use client";
import { useState } from "react";
import { login } from "@/app/admin/actions";
export default function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <section className="practice-wrap">
      <span className="eyebrow">Administrator access</span>
      <h1 style={{ fontSize: 40 }}>Welcome back.</h1>
      <form
        style={{ display: "grid", gap: 15, maxWidth: 420 }}
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const result = await login(new FormData(e.currentTarget));
            if (result) setError(result.error);
          } catch {
            setError("Could not sign in. Please try again.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="form-label">
          Email
          <input name="email" type="email" required autoComplete="username" />
        </label>
        <label className="form-label">
          Password
          <input
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete="current-password"
          />
        </label>
        <button className="primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="error" role="status">
          {error}
        </p>
      </form>
    </section>
  );
}
