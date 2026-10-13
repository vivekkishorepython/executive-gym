import Header from "@/components/Header";
import Practice from "@/components/Practice";
import { publishedCards } from "@/lib/cards";
import { categories } from "@/lib/types";
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; mode?: string }>;
}) {
  const query = await searchParams;
  const all = await publishedCards();
  const category = categories.find((c) => c === query.category);
  const cards = category ? all.filter((c) => c.category === category) : all;
  return (
    <main className="shell">
      <Header />
      <Practice
        cards={cards}
        weak={query.mode === "weak"}
        title={
          query.mode === "weak"
            ? "Practice my weak cards"
            : category || "Your daily practice"
        }
      />
    </main>
  );
}
