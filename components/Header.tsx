import Link from "next/link";
export default function Header() {
  return (
    <header className="nav">
      <Link href="/" className="brand">
        <span className="brand-mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        executive gym
        <span style={{ fontSize: 9, alignSelf: "start", marginTop: 3 }}>™</span>
      </Link>
      <nav className="nav-links" aria-label="Main">
        <Link href="/#categories">The gym</Link>
        <Link href="/#story">Our story</Link>
        <Link className="pill" href="/practice?mode=weak">
          My practice ↗
        </Link>
      </nav>
    </header>
  );
}
