# Contributing

To keep the main branch stable and deployable, follow this workflow for every change:

## Required Workflow
- Run `npm install` to ensure dependencies are up to date.
- Run `npm run build` locally and fix all build errors before committing.
  - This runs Next’s type checking and ESLint. The build must pass with 0 errors.
- Prefer small, focused commits with clear messages.
- After changes are committed, push to a branch and open a PR if collaborating.

## Notes
- If you’re unable to run the full build locally (e.g., restricted environment), at minimum run `next lint` and resolve all reported errors, then run the build on your machine/CI before merging.
- Avoid adding dependencies unless necessary; prefer small, local utilities/components.
- Keep changes scoped to the task; avoid unrelated refactors.

## Project Commands
- `npm run dev` — Start the app locally
- `npm run build` — Production build with type checking + lint
- `npm start` — Run the production build

