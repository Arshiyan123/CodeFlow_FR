# CodeFlow

A Monkeytype-style typing trainer that helps engineers build muscle memory for interview coding solutions by typing them against a ghosted reference.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/codeflow run dev` — run the CodeFlow web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Frontend: React + Vite (`artifacts/codeflow`), Tailwind, Radix UI, framer-motion, wouter, react-query
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/codeflow/src/data/problems.ts` — the bundled problem library (24 problems, C++/Java/Python optimized solutions). Static data, no backend dependency.
- `artifacts/codeflow/src/lib/typing-engine.ts` — the core whitespace/indentation-aware typing comparison engine (`evaluateTyped`, `computeStrictMask`, `computeSessionStats`). This is business logic, not UI — treat it as the source of truth for correctness.
- `artifacts/codeflow/src/lib/device-id.ts`, `local-stats.ts`, `use-backend-status.ts` — anonymous device-based sync layer (no accounts/login).
- `artifacts/codeflow/src/hooks/use-theme.tsx`, `use-settings.tsx` — theme (Inferno/Cobalt/Neon) and sound/volume settings, persisted to localStorage.
- `lib/api-spec/openapi.yaml` — OpenAPI contract for the `sync` endpoints (sessions, stats, leaderboard), all keyed by `deviceId`.
- `lib/db/src/schema/practice-sessions.ts` — Drizzle schema for `practice_sessions`. `DeviceStats`/`LeaderboardEntry` are computed at query time, not separate tables.
- `artifacts/api-server/src/routes/sync.ts` — sync API routes.

## Architecture decisions

- No user accounts/auth. Practice history and stats sync via an anonymous, client-generated `deviceId` stored in localStorage — a deliberate scope cut vs. full login, since sync is an optional enhancement, not the core product.
- The frontend must work fully offline: problems are bundled as static TS (not fetched), and `local-stats.ts` is the local-first source of truth for session history/aggregates. The backend is only used opportunistically when reachable (`useBackendStatus`).
- The app never executes or evaluates code — it only measures typing accuracy against a reference solution string. No sandboxing or "run" functionality exists or should be added.
- The typing comparison engine tolerates flexible horizontal whitespace around operators/punctuation but strictly enforces indentation, newlines, and whitespace inside string/char literals — see `typing-engine.ts` for the exact algorithm.

## Product

- Bundled problem library across common interview topics/difficulties, each with optimized (non-brute-force) C++/Java/Python solutions, complexity notes, and explanations.
- Monkeytype-style typing practice screen: ghosted reference solution behind the caret, live green/red per-character feedback, glowing caret, WPM/accuracy tracking.
- Three switchable themes (Inferno default, Cobalt, Neon) and a synthesized Web Audio sound design (keystroke ticks, error thuds, completion chime) with volume/mute controls.
- Stats dashboard (best/average WPM, accuracy, streaks, recent sessions) and a global leaderboard, backed by anonymous device sync with graceful offline fallback.

## User preferences

- User chose to build fully Replit-native first (pnpm workspaces, Replit artifacts, Replit-managed Postgres) rather than the npm/Docker-only setup described in the original spec. A portable npm/Docker/.env layer for GitHub export may be added later as an additive layer, not a replacement.

## Gotchas

- Files under `artifacts/codeflow/src/hooks/` that return JSX (context providers) must use the `.tsx` extension, not `.ts`, or esbuild fails to parse the JSX.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
