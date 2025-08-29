# Refactor Plan — Prioritized

This document tracks recommended improvements and what’s already shipped. Items are ordered by importance.

## Completed (shipped to main)
- Extracted day-boundary util: `toDateInTz` → `src/lib/dates.ts`; routes now import it.
- DRY entry mapper: `mapEntryRow` → `src/lib/api.ts`; reused across entries API routes.
- Signup redirect parity: `SignupClient` uses `NEXT_PUBLIC_SITE_URL` for `emailRedirectTo`.
- AuthNav stability: memoized Supabase client and added stable auth subscription deps.
- Local storage keys centralized: added `ENTRY_PREFIX`, `DRAFT_PREFIX`, and `draftKey()`; `TimerEditor` updated to use helpers.

## Top Priority (correctness/perf)
- Timer stale submit (TimerEditor)
  - File: `src/components/TimerEditor.tsx:80`
  - Issue: The timer effect calls `doSubmit()` without depending on the latest `text` (stale closure risk at timeout). Prefer a `useRef` for current text/startedAt and read from it in the interval callback (no need for useCallback with React 19).
  
Optional follow‑up
- AuthNav singleton: current memoization works; consider promoting the browser client to a module‑level singleton for even simpler subscription code.
- Server RPC for day boundary: future hardening — move day computation into a DB function to guarantee consistency across clients and handle DST edges.

## High Value (maintainability/UX)
- Auth UI duplication
  - Files: `src/components/LoginClient.tsx`, `src/components/SignupClient.tsx`
  - Action: Factor shared Google button + signed-in redirect and error presentation to a small shared component/hook.
- Global hover styles robustness
  - File: `src/app/globals.css`
  - Issue: Uses substring selectors like `button[class*="border"]`. Prefer shared utility classes (e.g., `btn`, `btn-outline`) to decouple styling from exact Tailwind class strings.
- Streak computation fetch size
  - File: `src/components/StreakBadge.tsx`
  - Issue: Fetches all entries to compute streaks. Add an endpoint that returns `{ current, best }` or only dates to reduce payload size as data grows.

## Medium Priority (polish)
- Hooks deps vs suppressions
  - File: `src/components/TimerEditor.tsx`
  - Action: Replace global `exhaustive-deps` disable with `useRef`‑based interval (React 19) and keep effects minimal.
- Supabase typed rows
  - Action: Generate types from Supabase (`supabase gen types typescript ...`) and use them in handlers to remove hand-rolled row types.
- API response consistency
  - Action: Standardize 404/200 + `{exists:false}` patterns and error payload shape; optionally add Zod for request validation.

## Low-Hanging Cleanups
- Lint noise
  - Add missing deps where safe; memoize clients; avoid self-referential deps in `useMemo`.
- DRY auth-aware fetch
  - Provide a helper like `fetchAuthed(url)` returning `{ ok, data, authed }` and reuse in components that fall back to local on 401.
- Minor a11y
  - Consider elevated `aria-live` for the last 5 seconds of the timer; verify focus-visible on all interactive elements.

## Nice-to-Have (later)
- Rate limiting on write endpoints.
- Server export range + streaming for large datasets.
- Unit tests for `computeStreaks` and day-boundary util; a couple of API auth/409 tests.
- DB RPC `create_today_entry(text, started_at)` to centralize constraints.
