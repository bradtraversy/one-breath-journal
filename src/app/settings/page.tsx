import ExportButton from "@/components/ExportButton";
import TimezoneSettings from "@/components/TimezoneSettings";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      {user ? (
        <TimezoneSettings />
      ) : (
        <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6">
          <p className="text-sm">Sign in to manage your profile settings. <Link className="underline" href="/login">Sign in</Link></p>
        </div>
      )}

      <div className="rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 backdrop-blur p-6 space-y-3">
        <h2 className="text-sm font-medium">Data</h2>
        <p className="text-sm opacity-70">Export your locally saved entries as JSON.</p>
        <ExportButton />
      </div>

      <p className="text-sm opacity-70">Account and privacy controls will be added here.</p>
    </div>
  );
}
