import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthNav from "@/components/AuthNav";
import Icon from "@/components/Icon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "One‑Breath Journal",
  description: "Write once per day in 60 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <header className="border-b border-black/10 dark:border-white/15">
          <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold">One‑Breath Journal</Link>
            <div className="flex items-center gap-4">
              <AuthNav />
              <a
                href="https://github.com/bradtraversy/one-breath-journal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub repository"
                className="opacity-80 hover:opacity-100 transition"
                title="GitHub"
              >
                <Icon name="github" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-3xl px-4 pb-10 text-xs opacity-75">
          Private by default. One entry per day.
        </footer>
      </body>
    </html>
  );
}
