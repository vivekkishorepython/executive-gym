import "server-only";
import { configured, userClient } from "./supabase";
export function isAdministrator(
  userId: string | undefined,
  adminId: string | undefined,
) {
  return Boolean(userId && adminId && userId === adminId);
}
export async function requireAdmin() {
  if (!configured()) throw new Error("Unauthorized");
  const client = await userClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !isAdministrator(user?.id, process.env.ADMIN_USER_ID))
    throw new Error("Unauthorized");
  return client;
}
