import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Executive Gym — Build your executive reflexes",
  description:
    "Practice assertiveness, executive presence, and influence. One workplace moment at a time.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
