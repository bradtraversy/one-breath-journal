# Contributing Guide

Thanks for your interest in contributing! This guide is for developers.

## Getting Started

- Prereqs: Node 18+ and npm.
- Install: `npm install`
- Dev server: `npm run dev` (http://localhost:3000)
- Environment: copy `.env.example` to `.env.local` and fill required vars.

## Branching & PRs

- Create a feature branch from `main` (See **Commit Messages** below)
- Keep PRs focused and small; include a clear description and screenshots if UI changes.
- Link related issues. Request review when ready.

## Code Style

- TypeScript: prefer explicit types when it improves readability.
- Linting: run `next lint` (auto-runs during build). Fix warnings when feasible.
- UI: keep components small; reuse existing patterns and the icon set.
- API: handle errors with appropriate status codes; prefer shared helpers in `src/lib` to avoid duplication.

## Testing & Build

- Ensure the app builds: `npm run build`.
- Add unit tests where practical; small pure utils (e.g., streak calculations) are good candidates.

## Commit Messages (mandatory)

- Use Conventional Commits for every commit. Format: `type(scope): summary`
  - Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `perf`, `test`, `build`, `ci`, `style`, `revert`.
  - Scope (optional but encouraged): short area like `auth`, `api`, `ui`, `header`.
  - Summary: imperative, present tense, concise (<= 72 chars ideal).
  - Body (optional): add context, reasoning, or breaking-change notes.

Examples from this repo

- `feat(auth): integrate Supabase email/password auth and sign-out`
- `fix(auth): complete Google OAuth with /auth/callback and server-side session detection`
- `feat(entries): add Supabase-backed entries API and wire client when authenticated`
- `refactor(api): DRY mapEntryRow via src/lib/api and reuse across routes`
- `docs(readme): add production Demo link`
- `docs(license): add MIT LICENSE`

## Reporting Issues

- Include steps to reproduce, expected vs actual behavior, and environment details.
- For security concerns, see below.

## Security

- Please report vulnerabilities privately to the maintainers.

## License

- By contributing, you agree your contributions are licensed under the repository’s MIT License (see `LICENSE`).
