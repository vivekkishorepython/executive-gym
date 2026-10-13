import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
// Fetch every page so published counts and CSV exports are never silently truncated.
export async function readAll<T>(
  db: SupabaseClient,
  table: "flashcards" | "subscribers",
  columns: string,
  publishedOnly = false,
): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; ; offset += 500) {
    let query = db
      .from(table)
      .select(columns)
      .order("id")
      .range(offset, offset + 499);
    if (publishedOnly) query = query.eq("published", true);
    const { data, error } = await query;
    if (error) throw error;
    rows.push(...(data as unknown as T[]));
    if (data.length < 500) break;
  }
  return rows;
}
