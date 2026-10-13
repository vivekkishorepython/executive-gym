"use client";
import { useCallback, useEffect, useState } from "react";
import Papa from "papaparse";
import { categories, type Card } from "@/lib/types";
import { cardSchema } from "@/lib/validation";
import { logout } from "@/app/admin/actions";
type Subscriber = {
  email: string;
  name: string;
  status: string;
  consent_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
};
const fresh = (): Omit<Card, "id"> => ({
  category: "Assertiveness",
  front: "",
  back: "",
  explanation: "",
  difficulty: "beginner",
  display_order: 1,
  published: false,
});
function download(rows: object[], name: string) {
  const safe = rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([k, v]) => [
        k,
        typeof v === "string" && /^[=+@\-\t\r]/.test(v) ? `'${v}` : v,
      ]),
    ),
  );
  const url = URL.createObjectURL(
    new Blob([Papa.unparse(safe)], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
export default function AdminDashboard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [card, setCard] = useState<Partial<Card>>(fresh());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const [c, s] = await Promise.all([
        fetch("/api/admin/cards", { cache: "no-store" }),
        fetch("/api/admin/subscribers", { cache: "no-store" }),
      ]);
      if (!c.ok || !s.ok) throw new Error();
      setCards(await c.json());
      setSubscribers(await s.json());
    } catch {
      setMessage("Could not load dashboard data. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  async function save(data: unknown) {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      setMessage(body.message);
      if (response.ok) {
        setCard(fresh());
        await load();
      }
    } catch {
      setMessage("Request failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const shown = cards.filter(
    (c) =>
      (!category || c.category === category) &&
      (!state || (state === "published") === c.published) &&
      `${c.front} ${c.back}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="admin">
      <div className="section-top">
        <div>
          <span className="eyebrow">Content studio</span>
          <h2>Build the next rep.</h2>
        </div>
        <form action={logout}>
          <button className="secondary">Sign out</button>
        </form>
      </div>
      <p role="status">{message}</p>
      {loading ? (
        <p role="status">Loading dashboard…</p>
      ) : (
        <>
          <div className="controls" style={{ justifyContent: "start" }}>
            <button
              className="secondary"
              onClick={() => download(cards, "executive-gym-cards.csv")}
            >
              Export cards
            </button>
            <label className="secondary">
              Import CSV
              <input
                type="file"
                accept=".csv,text/csv"
                style={{ display: "block", maxWidth: 220, marginTop: 8 }}
                disabled={busy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 1_000_000) {
                    setMessage("CSV must be smaller than 1 MB.");
                    return;
                  }
                  const result = Papa.parse<Record<string, string>>(
                    await file.text(),
                    { header: true, skipEmptyLines: true },
                  );
                  if (result.errors.length) {
                    setMessage("Malformed CSV. Please check the file.");
                    return;
                  }
                  const rows = result.data.map((row) => ({
                    ...row,
                    id: row.id || undefined,
                    published: row.published === "true",
                  }));
                  const validated = rows.map((row) =>
                    cardSchema.safeParse(row),
                  );
                  if (
                    !rows.length ||
                    rows.length > 500 ||
                    validated.some((r) => !r.success) ||
                    result.data.some(
                      (row) => !["true", "false"].includes(row.published),
                    )
                  ) {
                    setMessage(
                      "Invalid CSV. Use export headers, valid categories, and true/false publication values.",
                    );
                    return;
                  }
                  await save(validated.map((r) => r.data));
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <div className="admin-layout">
            <div>
              <div className="fields" style={{ marginBottom: 20 }}>
                <input
                  aria-label="Search cards"
                  placeholder="Search cards…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <select
                  aria-label="Filter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <select
                  aria-label="Publication status"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">All statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <p className="status">{shown.length} cards</p>
              <div className="admin-list">
                {shown.map((c) => (
                  <article className="admin-row" key={c.id}>
                    <span className="eyebrow">
                      {c.category} · {c.published ? "Published" : "Draft"}
                    </span>
                    <p>{c.front}</p>
                    <button className="secondary" onClick={() => setCard(c)}>
                      Edit
                    </button>{" "}
                    <button
                      className="secondary"
                      disabled={busy}
                      onClick={async () => {
                        if (!window.confirm("Delete this card permanently?"))
                          return;
                        setBusy(true);
                        try {
                          const response = await fetch("/api/admin/cards", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: c.id }),
                          });
                          setMessage((await response.json()).message);
                          if (response.ok) await load();
                        } catch {
                          setMessage("Delete failed. Please try again.");
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </article>
                ))}
                {!shown.length && <p>No matching cards.</p>}
              </div>
            </div>
            <div>
              <h2>{card.id ? "Edit card" : "New card"}</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const parsed = cardSchema.safeParse(card);
                  if (!parsed.success) {
                    setMessage("Check all fields before saving.");
                    return;
                  }
                  void save(parsed.data);
                }}
              >
                <label className="form-label">
                  Category
                  <select
                    value={card.category}
                    onChange={(e) =>
                      setCard({
                        ...card,
                        category: e.target.value as Card["category"],
                      })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                {(["front", "back", "explanation"] as const).map((field) => (
                  <label key={field} className="form-label">
                    {field === "front"
                      ? "Situation"
                      : field === "back"
                        ? "Response"
                        : "Explanation (optional)"}
                    <textarea
                      value={card[field]}
                      required={field !== "explanation"}
                      minLength={field === "explanation" ? 0 : 5}
                      maxLength={
                        field === "explanation"
                          ? 1000
                          : field === "front"
                            ? 500
                            : 600
                      }
                      onChange={(e) =>
                        setCard({ ...card, [field]: e.target.value })
                      }
                    />
                  </label>
                ))}
                <label className="form-label">
                  Difficulty
                  <select
                    value={card.difficulty}
                    onChange={(e) =>
                      setCard({
                        ...card,
                        difficulty: e.target.value as Card["difficulty"],
                      })
                    }
                  >
                    <option>beginner</option>
                    <option>intermediate</option>
                    <option>advanced</option>
                  </select>
                </label>
                <label className="form-label">
                  Display order
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={card.display_order}
                    onChange={(e) =>
                      setCard({
                        ...card,
                        display_order: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label className="consent">
                  <input
                    type="checkbox"
                    checked={card.published}
                    onChange={(e) =>
                      setCard({ ...card, published: e.target.checked })
                    }
                  />
                  Published (uncheck to save as draft)
                </label>
                <button className="primary" disabled={busy}>
                  {busy ? "Saving…" : "Save card"}
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setCard(fresh())}
                >
                  Start new card
                </button>
              </form>
            </div>
          </div>
          <section style={{ marginTop: 40 }}>
            <div className="section-top">
              <h2>Subscribers</h2>
              <button
                className="secondary"
                onClick={() =>
                  download(subscribers, "executive-gym-subscribers.csv")
                }
              >
                Export subscribers
              </button>
            </div>
            {subscribers.length ? (
              subscribers.map((s) => (
                <div key={s.email} className="admin-row">
                  <strong>{s.email}</strong> · {s.name || "No name"}
                  <p className="status">
                    {s.status} · Consent: {s.consent_at} · Confirmed:{" "}
                    {s.confirmed_at || "Pending"} · Unsubscribed:{" "}
                    {s.unsubscribed_at || "No"}
                  </p>
                </div>
              ))
            ) : (
              <p>No subscribers yet.</p>
            )}
          </section>
        </>
      )}
    </section>
  );
}
