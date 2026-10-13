import Header from "@/components/Header";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { requireAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function Admin() {
  let authorized = false;
  try {
    await requireAdmin();
    authorized = true;
  } catch {}
  return (
    <main className="shell">
      <Header />
      {authorized ? <AdminDashboard /> : <AdminLogin />}
    </main>
  );
}
