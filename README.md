# One‑Breath Journal

Write once per day, for up to 60 seconds. This project is built in phases starting with a local‑first prototype, then layering auth and a database.

See the full product context and plan in `docs/one-breath-journal-context.md`.

## Current Phase — Local‑First

Implemented client‑only journaling using `localStorage` (no auth, no backend):
- Today view with a 60s timer, local draft autosave, early submit, and auto‑submit on timeout.
- Lock the entry for the day after submit/timeout; show timestamps.
- Calendar with month navigation and dots on days that have entries; today highlighted.
- Entry detail page (read‑only) with delete action.
- Streaks (current/best) computed from local entries.
- Export all local entries to JSON from Settings.

## Tech
- Next.js App Router (Server Components first, with small client islands)
- Tailwind CSS v4
- TypeScript

## Run Locally

```bash
npm install
npm run dev
# http://localhost:3000
```

## App Structure (key files)
- `src/app/layout.tsx` — App shell and nav (server)
- `src/app/page.tsx` — Redirects `/` → `/today`
- `src/app/today/page.tsx` — Today screen (server) rendering client island components
- `src/app/calendar/page.tsx` — Calendar page (server)
- `src/app/entry/[id]/page.tsx` — Entry detail by date (server), unwraps `params` with `use()`
- `src/app/settings/page.tsx` — Settings (server)
- `src/components/TimerEditor.tsx` — Client: timer, editor, submit/lock
- `src/components/StreakBadge.tsx` — Client: streak computation and updates
- `src/components/CalendarClient.tsx` — Client: month nav + grid with dots
- `src/components/EntryClient.tsx` — Client: read‑only entry + delete
- `src/components/ExportButton.tsx` — Client: JSON export
- `src/lib/local.ts` — LocalStorage helpers and streak utility
- `docs/one-breath-journal-context.md` — Product context and 1‑week plan

## Local Data Model
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
Phase 1 (done)
- Local‑first journaling, calendar, entry view, delete, export.

Phase 2
- Auth (email link + Google). Minimal profile with timezone.
- Postgres + Prisma; migrate local entries on first login.
- Server APIs for entries, export, and delete; row‑level authorization.

Phase 3
- Calendar streaks on server; DST/timezone hardening; rate limiting.
- Settings: timezone selector, privacy copy, optional reminders.
- PWA polish for install + offline (optional).

Future Ideas
- Client‑side encryption (zero‑knowledge mode).
- Gentle reminders (email/push), tags/mood, insights.
- Opt‑in AI reflections/summaries.

## Accessibility & Privacy
- Large accessible countdown; keyboard‑friendly editor.
- Color contrast and visible focus states.
- Private by default; no third‑party analytics in the local phase.
