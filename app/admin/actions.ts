"use server";
import { redirect } from "next/navigation";
import { configured, userClient } from "@/lib/supabase";
import { isAdministrator } from "@/lib/auth";
import { z } from "zod";
export async function login(form: FormData) {
  if (!configured())
    return { error: "Configure Supabase to enable admin sign-in." };
  const parsed = z
    .object({ email: z.string().email(), password: z.string().min(8).max(200) })
    .safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success)
    return {
      error: "Enter a valid email and password (at least 8 characters).",
    };
  const db = await userClient();
  const { data, error } = await db.auth.signInWithPassword(parsed.data);
  if (error || !isAdministrator(data.user?.id, process.env.ADMIN_USER_ID)) {
    await db.auth.signOut();
    return { error: "Unable to sign in with those credentials." };
  }
  redirect("/admin");
}
export async function logout() {
  if (configured()) {
    const db = await userClient();
    await db.auth.signOut();
  }
  redirect("/admin");
}
