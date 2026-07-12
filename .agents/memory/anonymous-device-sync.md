---
name: Anonymous device-based sync (no auth)
description: Pattern for optional cross-device stat/history sync without building full user accounts, when auth is out of scope or explicitly deferred.
---

When a product needs to persist and aggregate user activity (session history, stats, leaderboards) but full accounts/login are out of scope or deferred, use a client-generated random `deviceId` (e.g. `crypto.randomUUID()`) stored in `localStorage` as the sync key instead of a real user identity. Backend endpoints accept `deviceId` as a plain query/body field with no auth middleware.

**Why:** Full login is heavier scope and often only an "optional" requirement in the spec; this gets working cross-device-ish persistence with a fraction of the effort, and keeps the frontend fully usable offline.

**How to apply:** Pair this with a local-first storage layer (e.g. `local-stats.ts`) that is always written to synchronously on completion of the tracked action, and only opportunistically synced to the backend when a lightweight health/connectivity check succeeds. The UI must never block or error out when the backend is unreachable — local storage is the source of truth, the backend is a bonus aggregation layer (useful for global leaderboards local storage can't provide).
