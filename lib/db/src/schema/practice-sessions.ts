import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// A single completed (or abandoned) typing practice run, keyed by an
// anonymous client-generated deviceId (no accounts/auth in this app).
export const practiceSessionsTable = pgTable("practice_sessions", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  problemId: text("problem_id").notNull(),
  problemTitle: text("problem_title").notNull(),
  language: text("language").notNull(), // 'cpp' | 'java' | 'python'
  wpm: real("wpm").notNull(),
  accuracy: real("accuracy").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPracticeSessionSchema = createInsertSchema(practiceSessionsTable).omit({
  id: true,
  completedAt: true,
});
export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;
export type PracticeSessionRow = typeof practiceSessionsTable.$inferSelect;
