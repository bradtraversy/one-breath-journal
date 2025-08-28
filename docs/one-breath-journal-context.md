# One‑Breath Journal — Context & Plan

A simple, calming journal where you write once per day for up to 60 seconds. Focus: low friction, privacy-first defaults, and a satisfying daily ritual.

## Product Summary
- Purpose: Reduce journaling friction by constraining time and frequency.
- Core actions: Start 60s session, write, submit, view streak + calendar.
- Tone: Minimal, no feeds, no notifications by default.

## Principles
- Constraint-driven: One entry/day; 60s timer guides brevity.
- Gentle UX: No cross-day nags; encouragement over gamification.
- Private by default: Entries are only visible to the author.
- Local-first feel: Instant interactions; resilient to brief offline.

## Personas & Jobs
- Reflector: “Capture a snapshot of how I feel today.”
- Overwhelmed doer: “Journal without the pressure of ‘doing it right’.”
- Consistency seeker: “Keep a streak that feels light, not punitive.”

## MVP Scope
- Auth: Email magic link OR OAuth (Google). Minimal profile.
- Today’s entry: One per calendar day in user’s timezone.
- Timer: 60s visible countdown; editable until submit or time runs out.
- Locking: After submit or timer ends, text is locked for that day.
- Views: Today screen, Calendar (month grid), Entry detail read-only.
- Streaks: Auto-calculated (display current and best streak).
- Data portability: Export all entries (JSON). Delete account.
- Privacy: Private entries; no social features.

Out of scope (MVP): public sharing, tags, images, AI, comments, mobile apps, reminders.

## Rules & Edge Cases
- Timezone: Day boundary is local to user’s selected timezone (default from browser on first login; stored setting).
- One per day: Server enforces unique (user_id, entry_date).
- Timer behavior:
  - User may submit early; on timeout, auto-submit with current text.
  - Draft saved locally while typing; nothing sent until submit/timeout.
- Late edits: No edits post-submit/timeout on same day (MVP). Future: 5‑minute grace period toggle.
- Connectivity: If offline at timeout, queue submission and mark with pending status; sync when online.
- Deletion: User can delete past entries individually or full account (irreversible).

## Data Model
```sql
-- Times in UTC; entry_date is date in user_timezone at submit time
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  timezone TEXT NOT NULL DEFAULT 'UTC'
);

CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL, -- day per user timezone
  text TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL,
  word_count INT GENERATED ALWAYS AS (
    CASE WHEN length(trim(text))=0 THEN 0
         ELSE array_length(regexp_split_to_array(trim(text), '\\s+'),1) END
  ) STORED,
  source TEXT NOT NULL DEFAULT 'web', -- web/pwa
  UNIQUE(user_id, entry_date)
);

CREATE INDEX idx_entries_user_date_desc ON entries(user_id, entry_date DESC);
```
Derived values (no tables):
- Current streak, best streak: derive from consecutive `entry_date`s.

Optional (later): `user_settings` (reminders, theme, autosubmit toggle).

## API Surface (MVP)
Auth handled by provider; all endpoints require auth.
- GET `/api/me` → profile {id, email, timezone}.
- PATCH `/api/me` → update timezone.
- GET `/api/entries/today` → {exists, entry} by server-side day calc.
- POST `/api/entries` → create today’s entry; body: {text, startedAt}.
- GET `/api/entries?from=YYYY-MM-DD&to=YYYY-MM-DD` → list for calendar.
- GET `/api/entries/:id` → entry detail.
- DELETE `/api/entries/:id` → delete past entry (not today if locked).
- POST `/api/export` → downloadable JSON of all entries.

Error cases:
- 409 on second create same day.
- 422 for empty payloads (allow empty text? MVP: allow, records blank day).

## Client UX
- Pages: `/today`, `/calendar`, `/entry/:id`, `/settings`.
- Timer: Large, accessible countdown; keyboard-only friendly.
- Editor: Plain textarea; character/word counter optional; autosave to localStorage each keystroke.
- Calendar: Month grid with markers; click to view.
- Streak: Small widget on `/today` and `/calendar`.
- Empty states: Friendly prompts; no pressure language.

Accessibility
- Respect reduced motion; color contrast AA; focus visible.
- Announce timer with ARIA live region; pause not required (MVP).

## Non‑Functional & Privacy
- Performance: First load < 1s TTI on average broadband.
- Availability: Ok to be single-region initially; nightly backups.
- Privacy: No third-party analytics in MVP; minimal logs (no entry text in logs).
- Security: Server-side auth checks; row-level authorization by user_id.
- Data rights: Export + delete flows; 30-day retention for deletes (optional).

## Tech Stack (suggested)
- Web: Next.js (App Router) + React Server Components.
- Styling: Tailwind CSS + Headless UI.
- Auth: Clerk or Supabase Auth (email link + Google).
- DB: Postgres (Supabase/Fly/Neon) + Prisma ORM.
- Hosting: Vercel (web) + managed Postgres.
- Offline: Basic localStorage draft; optional PWA for install later.

Alternatives: Remix, SvelteKit, Lucia auth; pick what you prefer.

## One‑Week Build Plan
Day 1 — Foundations
- Create Next.js app, Tailwind, ESLint/Prettier.
- Set up auth provider; protect routes.
- Define Prisma schema; run migrations; seed none.

Day 2 — API + Data
- Implement `/api/me`, `/api/entries` CRUD with auth checks.
- Enforce timezone day logic; unique (user_id, entry_date) constraint.
- Add export endpoint; basic JSON stream.

Day 3 — Today Screen
- Build timer + textarea with local draft.
- Handle submit + timeout autosubmit; optimistic UI; error toasts.
- Lock UI after submit/timeout with read-only view.

Day 4 — Calendar + Detail
- Month grid with markers; fetch range API.
- Entry detail read-only; delete past entry action (confirm modal).
- Streak calculation util; display current/best.

Day 5 — Settings + Polish
- Timezone selector; persist to profile.
- Empty/error states, accessibility pass, responsive tweaks.
- Basic analytics (self-hosted or none); add privacy copy.

Day 6 — QA + Hardening
- Unit tests for streak util; API auth tests.
- Handle edge cases: DST boundaries; offline queue sanity.
- Add rate limiting to write endpoints.

Day 7 — Deploy
- Provision DB, environment; run migrations.
- Configure domains, SSL, error monitoring.
- Create release notes and a short demo clip.

## Metrics (MVP)
- Activation: % who complete first entry after signup.
- Retention: D1/D7 return rates; 3+ day streak share.
- Quality: Avg words per entry; completion rate before/at timeout.
- Reliability: API error rate; p95 latency.

## Risks & Mitigations
- Timezone/DST bugs → Use robust libs (Temporal polyfill or date-fns-tz); test boundaries.
- Data loss on timeout when offline → Local draft + background sync; alert if not synced.
- Over-gamification pressure → Keep streak subtle; no red break indicators.

## Future Ideas
- Gentle reminders (email/push) at chosen hour.
- Tags or mood picker; charts.
- Client-side encryption for text (zero-knowledge mode).
- AI reflections (summaries, prompts) as opt-in labs.
- PWA with offline-first and background sync.

