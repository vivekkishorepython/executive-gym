import "server-only";
import { configured, userClient } from "./supabase";
import { seedCards } from "./content";
import type { Card } from "./types";
import { readAll } from "./database";
export async function publishedCards(): Promise<Card[]> {
  if (!configured()) return seedCards;
  const db = await userClient();
  try {
    return (await readAll<Card>(db, "flashcards", "*", true)).sort(
      (a, b) => a.display_order - b.display_order,
    );
  } catch {
    throw new Error("Unable to load practice cards. Please try again.");
  }
}
