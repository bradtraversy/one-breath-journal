# One‑Breath Journal

Write once per day, for up to 60 seconds. Low friction, privacy‑first, and a gentle daily ritual.

See the full product context and plan in `docs/one-breath-journal-context.md`.

## Current State
- Auth: Supabase email/password. Today, Calendar, and Settings are gated — guests see a public landing page and must sign in to create entries.
- Today: 60s timer, local draft autosave, early submit, auto‑submit on timeout; entry locks for the day.
- Calendar: Month grid with entry dots; click to view entries (read‑only) and delete.
- Streaks: Current/best, computed on the client from local entries.
- Export: Download all local entries as JSON from Settings.

Note: Entries are still stored in `localStorage` in this phase. Server APIs and data migration come next.

## Tech
- Next.js App Router (Server Components with small client islands)
- Tailwind CSS v4
- TypeScript
- Supabase Auth (via `@supabase/supabase-js` and `@supabase/ssr`)

## Setup
1) Supabase
- Create a Supabase project and run `docs/supabase-setup.sql` in the SQL editor (creates `profiles` and `entries` with RLS).
- Enable Email/Password under Auth → Providers. Optional: enable Google.
- Settings → API: copy Project URL and Public API key (anon).

2) Env vars
- Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-public-anon-key>
```

3) Install & run
```bash
npm install
npm run dev
# http://localhost:3000
```

## App Structure (key files)
- `src/app/layout.tsx` — App shell, nav with auth state
- `src/app/page.tsx` — Landing for guests; authed users redirected to `/today`
- `src/app/login/page.tsx` — Sign in (email/password)
- `src/app/signup/page.tsx` — Sign up (email/password)
- `src/app/today/page.tsx` — Today (auth‑gated)
- `src/app/calendar/page.tsx` — Calendar (auth‑gated)
- `src/app/entry/[id]/page.tsx` — Entry detail (read‑only)
- `src/app/settings/page.tsx` — Settings (auth‑gated) with timezone control
- `src/app/api/me/route.ts` — Profile read/update (timezone)
- `src/components/TimerEditor.tsx` — Timer, editor, submit/lock
- `src/components/StreakBadge.tsx` — Streak computation and updates
- `src/components/CalendarClient.tsx` — Month grid with dots
- `src/components/EntryClient.tsx` — Read‑only entry + delete
- `src/components/ExportButton.tsx` — JSON export
- `src/components/Landing.tsx` — Public landing page
- `src/components/TimezoneSettings.tsx` — Client timezone control using `/api/me`
- `src/components/Icon.tsx` — Inline SVG icon set
- `src/lib/local.ts` — LocalStorage helpers and streak utility
- `src/lib/supabase/server.ts` / `src/lib/supabase/client.ts` — Supabase helpers
- `docs/one-breath-journal-context.md` — Product context and plan

## Local Data Model (current)
Entries are stored in `localStorage` as JSON with keys `entry:YYYY-MM-DD` containing:

```json
{
  "text": "your entry",
  "startedAt": "2025-08-28T14:00:00.000Z",
  "submittedAt": "2025-08-28T14:01:00.000Z"
}
```

Drafts are stored per‑day under `draft:YYYY-MM-DD` and cleared on submit.

## Roadmap
- Next: Entries CRUD API on Supabase (RLS enforced), server‑computed day boundary by timezone, and export endpoint.
- Migration: Import existing local entries to your account on first login from Settings.
- Later: DST hardening, rate limiting, optional reminders and PWA polish.

## Accessibility & Privacy
- Large accessible countdown; keyboard‑friendly editor.
- Color contrast and visible focus states.
- Private by default; no third‑party analytics.
