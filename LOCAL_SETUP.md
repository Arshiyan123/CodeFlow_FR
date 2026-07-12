# Running CodeFlow Locally (Windows)

This project was originally scaffolded on Replit using **pnpm**. It has been
converted to run on plain **npm** so it works outside of Replit, including
after you `git clone` / download-and-unzip it from GitHub.

## What changed from the Replit version

* `pnpm-lock.yaml` and `pnpm-workspace.yaml` removed.
* Root `package.json` now uses npm `workspaces` instead of pnpm workspaces.
* All `catalog:` version references (a pnpm-only feature) replaced with real
  pinned versions.
* All `workspace:*` internal references replaced with `*` (npm's equivalent).
* The `preinstall` script that blocked `npm install` and forced pnpm has been
  removed.
* Added `concurrently`, `cross-env`, and `dotenv-cli` so the frontend and API
  server can be started together with one command, cross-platform (works the
  same on Windows/Mac/Linux).
* Added `docker-compose.yml` for a local Postgres database (Replit's built-in
  database is not available once you run this outside Replit).
* The `@replit/*` Vite plugins (cartographer, dev banner) only activate when
  a Replit-specific `REPL_ID` environment variable is present — they will
  simply stay off automatically on your machine, no action needed.
* `@replit/connectors-sdk` was in the original `package.json` but is unused
  anywhere in the code, so it's safe to ignore.

## 1. Prerequisites

* **Node.js 20+** — https://nodejs.org (LTS is fine)
* **Docker Desktop** (recommended, for local Postgres) — https://www.docker.com/products/docker-desktop
  * Don't want Docker? You can instead install Postgres directly and just
    point `DATABASE_URL` at it — see step 4.

## 2. Install dependencies

Open a terminal (Command Prompt, PowerShell, or Git Bash) in the project
folder:

```bash
npm install
```

## 3. Set up your environment file

```bash
copy .env.example .env
```
*(On Mac/Linux/Git Bash use `cp .env.example .env` instead.)*

The defaults in `.env.example` already match the default `docker-compose.yml`
credentials, so you normally don't need to edit anything.

## 4. Start the local database

**Option A — Docker (recommended):**
```bash
docker compose up -d
```
This starts a Postgres container on `localhost:5432` with a persistent
volume, matching the `DATABASE_URL` in `.env.example`.

**Option B — Your own local Postgres install:**
Create a database yourself, then edit `DATABASE_URL` in `.env` to point to it.

**Skip this entirely?** You can! The frontend (typing practice, themes,
sounds, all bundled problems) works fully client-side even with no database
and no backend running. The database is only needed for syncing stats /
leaderboard across devices.

## 5. Push the database schema

Once Postgres is running:
```bash
npm run db:push
```

## 6. Run the app

```bash
npm run dev
```

This starts **both** the API server and the frontend together in one
terminal (colored `[API]` / `[WEB]` log prefixes):

* Frontend: http://localhost:24527
* API server: http://localhost:8080/api (health check: http://localhost:8080/api/healthz)

Open http://localhost:24527 in your browser.

## Optional: run only the frontend or only the API

```bash
npm run dev:web    # frontend only
npm run dev:api    # API server only (needs DATABASE_URL working)
```

## Troubleshooting

* **"DATABASE_URL must be set" error from the API server** — make sure you
  copied `.env.example` to `.env` (step 3) and that Postgres is actually
  running (step 4). The frontend itself will still work without this.
* **Port already in use** — something else on your machine is using
  `24527` or `8080`. Edit the port numbers in the `dev:api` / `dev:web`
  scripts in the root `package.json`, and update `.env` / `vite.config.ts`
  expectations to match if you change them.
* **`docker compose` command not found** — make sure Docker Desktop is
  installed and running; on older Docker versions the command is
  `docker-compose` (with a hyphen) instead.
