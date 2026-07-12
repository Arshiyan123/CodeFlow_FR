// Client-only persistence for practice sessions. This is the source of truth
// whenever the backend is unreachable, and is always written to first so the
// app is fully usable offline. When the backend is reachable, sessions are
// additionally synced there (see useBackendStatus + the sync hooks).

export interface LocalSession {
  id: string;
  problemId: string;
  problemTitle: string;
  language: 'cpp' | 'java' | 'python';
  wpm: number;
  accuracy: number;
  durationSeconds: number;
  completedAt: string;
  synced: boolean;
}

const STORAGE_KEY = 'codeflow:localSessions';

export function getLocalSessions(): LocalSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalSession[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalSession(session: Omit<LocalSession, 'id' | 'synced'>): LocalSession {
  const sessions = getLocalSessions();
  const full: LocalSession = { ...session, id: crypto.randomUUID(), synced: false };
  sessions.unshift(full);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 500)));
  return full;
}

export function markLocalSessionsSynced(ids: string[]): void {
  const sessions = getLocalSessions();
  const idSet = new Set(ids);
  const updated = sessions.map((s) => (idSet.has(s.id) ? { ...s, synced: true } : s));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export interface LocalAggregateStats {
  totalSessions: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
}

export function computeLocalAggregateStats(): LocalAggregateStats {
  const sessions = getLocalSessions();
  if (sessions.length === 0) {
    return { totalSessions: 0, bestWpm: 0, averageWpm: 0, averageAccuracy: 0, currentStreak: 0, longestStreak: 0 };
  }

  const bestWpm = Math.max(...sessions.map((s) => s.wpm));
  const averageWpm = Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length);
  const averageAccuracy = Math.round((sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length) * 10) / 10;

  // Streak = consecutive calendar days with at least one completed session.
  const days = Array.from(
    new Set(sessions.map((s) => new Date(s.completedAt).toISOString().slice(0, 10))),
  ).sort((a, b) => (a < b ? 1 : -1));

  let currentStreak = 0;
  let cursor = new Date();
  for (const day of days) {
    const cursorStr = cursor.toISOString().slice(0, 10);
    if (day === cursorStr) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  let longestStreak = 0;
  let running = 0;
  for (let i = 0; i < days.length; i++) {
    if (i === 0) {
      running = 1;
    } else {
      const prev = new Date(days[i - 1]);
      const curr = new Date(days[i]);
      const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
      running = diffDays === 1 ? running + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, running);
  }

  return {
    totalSessions: sessions.length,
    bestWpm,
    averageWpm,
    averageAccuracy,
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
}
