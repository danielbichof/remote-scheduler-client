# Copilot Project Instructions

These instructions help AI agents contribute effectively to this codebase.

## Context / Vision
Single-page frontend (React + TypeScript + Vite) that will evolve into a hybrid work schedule manager (controle de presença remota/presencial, limites de lotação, visualização semanal). Currently only a landing page scaffold exists.

## Tech Stack
- Build/dev: Vite (see `package.json` scripts: `dev`, `build`, `preview`)
- Language: TypeScript (strict-ish, configurable via `tsconfig.app.json` / `tsconfig.node.json`)
- React 19 with functional components and hooks.
- Styling: Plain CSS modules at global level (`src/App.css`). No CSS-in-JS yet.

## Run / Build Workflow
- Start dev server: `npm run dev` (HMR via Vite)
- Production build: `npm run build` (Runs TypeScript build + Vite bundle)
- Preview prod build: `npm run preview`
- Lint: `npm run lint` (ESLint flat config in `eslint.config.js`)

Prefer updating or creating minimal tests later (none exist yet) – do NOT add heavy frameworks without justification.

## File / Directory Conventions
- `src/main.tsx`: React root render. Keep provider wiring (future auth / state) centralized here.
- `src/App.tsx`: Top-level routing or landing. Currently implements landing hero + header.
- Assets: `src/assets/` for static SVGs; root `public/` for static served files (e.g., `/vite.svg`).
- Global styles only in `src/index.css` and component-level in `src/App.css`. When adding new feature components, prefer colocated `.tsx` + `.css` (same folder) unless shared.

## Planned Domain (Implement Incrementally)
Core entities to anticipate:
- Employee (id, nome, time, função, preferências)
- Schedule / Shift (data, tipo: remoto|presencial, local/escritório, capacidade)
- Office (id, nome, capacidade)
- Reservation / Booking (colaborador + dia + local)

Avoid premature modeling; create light TypeScript interfaces in a `domain/` folder once first feature needs them.

## Future Architecture Direction
- Introduce a simple client-side state layer (Context + Reducer or lightweight Zustand) before data fetching libs.
- Abstract API calls in `src/api/` (create when first endpoint is integrated). Centralize base URL & fetch wrapper (with JSON + error normalization).
- Routing: Add React Router only when more than one logical page is needed (landing vs app shell). Place routes in `src/routes/`.

## CSS / Design Guidelines
- Current palette: dark background gradients (#1f2330 → #12151d) with accent gradient (#646cff to #61dafb).
- Buttons share gradient background class patterns; factor shared button styles into a `.btn` class if duplication rises.
- Keep responsive breakpoints mobile-first (initial layout, then widen). Example already in `App.css` with `@media (max-width: 860px)`.

## Coding Patterns
- Prefer functional components & hooks; avoid class components.
- Keep side-effects inside `useEffect`; pure render logic elsewhere.
- Derive minimal state (avoid duplicating derived values).
- Type first: define interfaces / types near usage or in `src/types/` (create if it grows > ~5 types).

## Adding Features (Example Flow)
1. Create domain type `ScheduleDay` in `src/domain/schedule.ts`.
2. Add mock data provider in `src/mocks/` exporting arrays for quick UI iteration (remove / replace when backend integrates).
3. Build a component `ScheduleGrid.tsx` under `src/components/schedule/` with clear props (e.g. days[], employees[], capacityMap).
4. Integrate into `App.tsx` or a new page route behind a temp flag.

## Linting / Quality
- Respect existing ESLint flat config; add rule adjustments there (do not create a second config).
- Run `npm run lint` before committing automated changes.

## Performance / Bundling
- Keep initial bundle lean; code-split when introducing authenticated app shell (e.g., dynamic import for heavy schedule views).

## Auth Placeholder
- Current login button triggers `alert`. Replace with real handler in a future `src/auth/` module (create folder). Keep the initial surface API: `login()` returning a Promise for consistency.

## PR / Change Expectations for Agents
- Small, focused commits (feature slice or refactor). Avoid mixing style reformat with logic.
- When introducing new structure (e.g., `domain/`, `api/`), include a short README in that folder explaining purpose.
- Provide minimal usage example in comments when exporting a new util / hook.

## Out of Scope (Until Needed)
- State libraries (Redux, MobX) – use simple context first.
- Complex design systems; keep raw CSS or lightweight utility classes.
- Testing framework setup beyond maybe Vitest (only when real logic emerges).

## Quick Reference
- Entry: `src/main.tsx`
- Root component: `src/App.tsx`
- Global styles: `src/index.css`, `src/App.css`
- Scripts: `package.json` -> dev/build/preview/lint

Keep instructions updated as soon as new architectural pieces (api, auth, state) land.


## Commits

Create commit messages using the conventional commits pattern

```
<type>(<optional scope>): <description>" \
  -m"<optional body>" \
  -m"<optional footer>"
```

### Types
- Changes relevant to the API or UI:
    - `feat` Commits that add, adjust or remove a new feature to the API or UI
    - `fix` Commits that fix an API or UI bug of a preceded `feat` commit
- `refactor` Commits that rewrite or restructure code without altering API or UI behavior
    - `perf` Commits are special type of `refactor` commits that specifically improve performance
- `style` Commits that address code style (e.g., white-space, formatting, missing semi-colons) and do not affect application behavior
- `test` Commits that add missing tests or correct existing ones
- `docs` Commits that exclusively affect documentation
- `build` Commits that affect build-related components such as build tools, dependencies, project version, CI/CD pipelines, ...
- `ops` Commits that affect operational components like infrastructure, deployment, backup, recovery procedures, ...
- `chore` Miscellaneous commits e.g. modifying `.gitignore`, ...