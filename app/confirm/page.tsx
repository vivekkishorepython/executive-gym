import TokenForm from "@/components/TokenForm";
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <main className="shell">
      <TokenForm kind="confirm" token={token || ""} />
    </main>
  );
}
