"use client";

import { useEffect, useMemo, useState } from "react";

type Profile = { id: string; email: string | null; timezone: string; created_at: string };

export default function TimezoneSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const detectedTz = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setProfile(data.profile as Profile);
    } catch (e: any) {
      setError(e?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveTimezone = async (tz: string) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: tz }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setProfile(data.profile as Profile);
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 space-y-4">
      <h2 className="text-sm font-medium">Timezone</h2>
      {loading ? (
        <div className="text-sm opacity-70">Loading…</div>
      ) : error ? (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      ) : profile ? (
        <div className="space-y-3">
          <div className="text-sm opacity-80">Current: <span className="font-mono">{profile.timezone}</span></div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/15"
              disabled={saving || profile.timezone === detectedTz}
              onClick={() => saveTimezone(detectedTz)}
            >
              Use detected ({detectedTz})
            </button>
            <button
              className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/15"
              disabled={saving || profile.timezone === "UTC"}
              onClick={() => saveTimezone("UTC")}
            >
              Use UTC
            </button>
          </div>
          <div className="text-xs opacity-70">We’ll use this timezone to determine your journaling day boundary.</div>
        </div>
      ) : (
        <div className="text-sm opacity-70">No profile found.</div>
      )}
    </div>
  );
}

