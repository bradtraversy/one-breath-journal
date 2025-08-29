import Link from "next/link";
import Icon from "@/components/Icon";

export default function Landing() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">One‑Breath Journal</h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          A simple, calming journal where you write once per day for up to 60 seconds. Low friction, privacy‑first, and a gentle daily ritual.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/signup?next=/today"
            className="px-5 py-2.5 rounded-md bg-black text-white dark:bg-white dark:text-black inline-flex items-center gap-2"
          >
            <Icon name="user-plus" className="w-4 h-4" />
            <span>Get started</span>
          </Link>
          <Link
            href="/login?next=/today"
            className="px-5 py-2.5 rounded-md border border-black/10 dark:border-white/15 inline-flex items-center gap-2"
          >
            <Icon name="log-in" className="w-4 h-4" />
            <span>Sign in</span>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid sm:grid-cols-3 gap-4">
        <Feature
          icon={<Icon name="play" className="w-6 h-6" />}
          title="Constraint that helps"
          desc="One entry per day, guided by a 60‑second timer to reduce pressure and overthinking."
        />
        <Feature
          icon={<Icon name="file" className="w-6 h-6" />}
          title="Local‑first feel"
          desc="Drafts save instantly on your device. Entries lock after submit or timeout."
        />
        <Feature
          icon={<Icon name="check" className="w-6 h-6" />}
          title="Private by default"
          desc="Your words are yours. No feeds, no public profiles, no ads."
        />
      </section>

      {/* How it works */}
      <section className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6">
        <h2 className="text-xl font-medium mb-3">How it works</h2>
        <ol className="space-y-2 text-sm opacity-90">
          <li>1. Open Today and press Start — the 60s timer begins.</li>
          <li>2. Write what’s present. Submit anytime; on timeout we auto‑submit.</li>
          <li>3. Your entry locks for the day. View it on the calendar.</li>
        </ol>
      </section>

      {/* Streaks & Calendar */}
      <section className="grid sm:grid-cols-2 gap-4">
        <Card title="Gentle streaks" desc="See your current and best streaks at a glance. Encouragement over pressure.">
          <div className="text-sm opacity-70">No red break indicators; just steady progress.</div>
        </Card>
        <Card title="Month view" desc="A clean calendar shows days you wrote. Click a day to read that entry.">
          <div className="text-sm opacity-70">Designed to be calm and distraction‑free.</div>
        </Card>
      </section>

      {/* Privacy */}
      <section className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6">
        <h2 className="text-xl font-medium mb-3">Privacy & portability</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm opacity-90">
          <li>Private by default — entries are only visible to you.</li>
          <li>Export your data anytime as JSON.</li>
          <li>No third‑party analytics in the core experience.</li>
        </ul>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 text-center space-y-2">
      <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/15 grid place-items-center mx-auto">
        {icon}
      </div>
      <div className="font-medium">{title}</div>
      <div className="text-sm opacity-80">{desc}</div>
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 space-y-2">
      <div className="font-medium">{title}</div>
      <div className="text-sm opacity-80">{desc}</div>
      {children}
    </div>
  );
}
