import { writeFileSync } from "node:fs";
import { seedCards } from "../lib/content";
const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
const rows = seedCards.map(
  (c) =>
    `(${[c.id, c.category, c.front, c.back, c.explanation, c.difficulty].map(quote).join(",")},${c.display_order},${c.published})`,
);
writeFileSync(
  "supabase/002_seed.sql",
  `-- Generated from lib/content.ts. Rerunning overwrites the stable seed IDs.\ninsert into public.flashcards(id,category,front,back,explanation,difficulty,display_order,published) values\n${rows.join(",\n")}\non conflict(id) do update set category=excluded.category,front=excluded.front,back=excluded.back,explanation=excluded.explanation,difficulty=excluded.difficulty,display_order=excluded.display_order,published=excluded.published;\n`,
);
