import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthNav from "@/components/AuthNav";

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
            <AuthNav />
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
