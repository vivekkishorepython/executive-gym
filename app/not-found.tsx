import Link from "next/link";
export default function NotFound() {
  return (
    <main className="shell empty">
      <h2>That page isn’t here.</h2>
      <Link className="primary" href="/">
        Back to the gym
      </Link>
    </main>
  );
}
