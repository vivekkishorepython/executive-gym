import { createClient } from "@supabase/supabase-js";
import { seedCards } from "../lib/content";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key)
  throw new Error(
    "Provide Supabase URL and service role key in the environment.",
  );
const db = createClient(url, key, { auth: { persistSession: false } });
const { error } = await db.from("flashcards").upsert(seedCards);
if (error) throw error;
console.log(
  `Seeded ${seedCards.length} cards. Rerunning updates these stable seed IDs.`,
);
