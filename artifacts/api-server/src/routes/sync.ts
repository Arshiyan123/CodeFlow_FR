import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, practiceSessionsTable } from "@workspace/db";
import {
  ListSessionsQueryParams,
  ListSessionsResponse,
  CreateSessionBody,
  CreateSessionResponse,
  GetStatsQueryParams,
  GetStatsResponse,
  GetLeaderboardResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/sync/sessions", async (req, res): Promise<void> => {
  const parsed = ListSessionsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const sessions = await db
    .select()
    .from(practiceSessionsTable)
    .where(eq(practiceSessionsTable.deviceId, parsed.data.deviceId))
    .orderBy(desc(practiceSessionsTable.completedAt))
    .limit(200);

  res.json(ListSessionsResponse.parse(sessions));
});

router.post("/sync/sessions", async (req, res): Promise<void> => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid session payload");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [created] = await db
    .insert(practiceSessionsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(CreateSessionResponse.parse(created));
});

router.get("/sync/stats", async (req, res): Promise<void> => {
  const parsed = GetStatsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { deviceId } = parsed.data;

  const sessions = await db
    .select({
      wpm: practiceSessionsTable.wpm,
      accuracy: practiceSessionsTable.accuracy,
      completedAt: practiceSessionsTable.completedAt,
    })
    .from(practiceSessionsTable)
    .where(eq(practiceSessionsTable.deviceId, deviceId))
    .orderBy(desc(practiceSessionsTable.completedAt));

  if (sessions.length === 0) {
    res.json(
      GetStatsResponse.parse({
        deviceId,
        totalSessions: 0,
        bestWpm: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        currentStreak: 0,
        longestStreak: 0,
      }),
    );
    return;
  }

  const totalSessions = sessions.length;
  const bestWpm = Math.max(...sessions.map((s) => s.wpm));
  const averageWpm = Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / totalSessions);
  const averageAccuracy =
    Math.round((sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions) * 10) / 10;

  const days = Array.from(
    new Set(sessions.map((s) => s.completedAt.toISOString().slice(0, 10))),
  ).sort((a, b) => (a < b ? 1 : -1));

  let currentStreak = 0;
  const cursor = new Date();
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
      const prev = new Date(days[i - 1]!);
      const curr = new Date(days[i]!);
      const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
      running = diffDays === 1 ? running + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, running);
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  res.json(
    GetStatsResponse.parse({
      deviceId,
      totalSessions,
      bestWpm,
      averageWpm,
      averageAccuracy,
      currentStreak,
      longestStreak,
    }),
  );
});

router.get("/sync/leaderboard", async (_req, res): Promise<void> => {
  const top = await db
    .select({
      problemTitle: practiceSessionsTable.problemTitle,
      language: practiceSessionsTable.language,
      wpm: practiceSessionsTable.wpm,
      accuracy: practiceSessionsTable.accuracy,
      completedAt: practiceSessionsTable.completedAt,
    })
    .from(practiceSessionsTable)
    .orderBy(desc(practiceSessionsTable.wpm))
    .limit(20);

  res.json(GetLeaderboardResponse.parse(top));
});

export default router;
